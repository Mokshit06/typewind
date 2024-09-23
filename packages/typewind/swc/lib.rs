use std::collections::HashMap;

use serde::Deserialize;
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_core::{
    common::DUMMY_SP,
    ecma::{
        ast::Program,
        ast::*,
        transforms::testing::test,
        visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
    },
};

#[derive(Deserialize)]
struct CandidateValueMap(HashMap<String, Vec<Vec<String>>>);

impl Default for CandidateValueMap {
    fn default() -> Self {
        setup_rule_map()
    }
}

fn fmt_to_tailwind(str: &str) -> String {
    str.chars()
        .map(|c| match c {
            '$' => '@',
            '_' => '-',
            c => c,
        })
        .collect()
}

fn inner_most_is_tw(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(ident) => ident.sym == *"tw",
        Expr::Member(member_expr) => inner_most_is_tw(&*member_expr.obj),
        Expr::Call(call_expr) => call_expr
            .callee
            .as_expr()
            .and_then(|expr| Some(inner_most_is_tw(&**expr)))
            .unwrap_or(false),
        _ => return false,
    }
}

fn analyse_expr(v: &mut TransformVisitor, wr: &mut Vec<String>, e: &Expr) {
    match e {
        Expr::Member(member_expr) => {
            let style = match &member_expr.prop {
                MemberProp::Ident(ident) => fmt_to_tailwind(ident.sym.as_ref()),
                MemberProp::Computed(computed) => {
                    match computed.expr.as_lit().expect("Only literal values allowed") {
                        Lit::Str(str) => str.value.to_string(),
                        _ => panic!("Only string literal values allowed"),
                    }
                }
                _ => panic!("Private values not allowed"),
            };

            if member_expr.prop.is_computed() {
                v.style_queue.push_str(&style);
            } else if !v.style_queue.is_empty() {
                let maybe_arbitrary_val = v.style_queue.as_str();
                let without_suffix = &style[..style.len() - 1];

                let CandidateValueMap(rule_map) = &v.rule_map;

                // @ means $ here as for opacity or named container queries etc.
                // its being replaced to @ by the fmt_to_tailwind fn
                if style.ends_with("@") {
                    wr.push(format!(
                        "{}{}/{}",
                        v.get_prefix(),
                        without_suffix,
                        maybe_arbitrary_val
                    ));
                } else if let Some(rules) = rule_map.get(without_suffix) {
                    let is_known_value = rules.iter().any(|rule| {
                        if rule.contains(&maybe_arbitrary_val.to_string()) {
                            true
                        } else {
                            false
                        }
                    });

                    if is_known_value {
                        wr.push(format!(
                            "{}{}{}",
                            v.get_prefix(),
                            style,
                            maybe_arbitrary_val
                        ));
                    } else {
                        wr.push(format!(
                            "{}{}[{}]",
                            v.get_prefix(),
                            style,
                            maybe_arbitrary_val
                        ));
                    }
                }

                v.style_queue.clear()
            } else {
                wr.push(format!("{}{}", v.get_prefix(), style));
            }

            analyse_expr(v, wr, &*member_expr.obj)
        }
        Expr::Call(call_expr) => {
            let CallExpr { callee, args, .. } = call_expr;

            let callee_member = callee
                .as_expr()
                .expect("callee can only be expr")
                .as_member()
                .expect("only member expr allowed");

            analyse_expr(v, wr, &callee_member.obj);

            let style = fmt_to_tailwind(
                callee_member
                    .prop
                    .as_ident()
                    .expect("callee can only be identifier")
                    .sym
                    .as_ref(),
            );

            if style == "raw" {
                let style = match &args
                    .get(0)
                    .expect("style not specified")
                    .expr
                    .as_lit()
                    .expect("Only literal values allowed")
                {
                    Lit::Str(str) => str.value.to_string(),
                    _ => panic!("Only string literal values allowed"),
                };

                wr.push(style);
            } else if style == "variant" {
                let prefix = match &args
                    .get(0)
                    .expect("variant not specified")
                    .expr
                    .as_lit()
                    .expect("Only literal values allowed")
                {
                    Lit::Str(str) => format!("[{}]:", str.value.as_ref()),
                    _ => panic!("Only string literal values allowed"),
                };

                v.cur_prefix.push(prefix);

                analyse_expr(v, wr, &*args.get(1).expect("style not specified").expr);

                v.cur_prefix.pop();
            } else {
                v.cur_prefix.push(if style == "important" {
                    "!".to_string()
                } else {
                    format!("{}:", style)
                });

                analyse_expr(v, wr, &*args.get(0).expect("style not specified").expr);

                v.cur_prefix.pop();
            }
        }
        _ => {}
    }
}

#[derive(Default)]
pub struct TransformVisitor {
    cur_prefix: Vec<String>,
    inside_tw: bool,
    style_queue: String,
    rule_map: CandidateValueMap,
}

impl TransformVisitor {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_prefix(&self) -> String {
        self.cur_prefix.join("")
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if (e.is_call() || e.is_member()) && !self.inside_tw && inner_most_is_tw(&e) {
            self.inside_tw = true;

            let mut wr = Vec::<String>::new();
            analyse_expr(self, &mut wr, &e);

            *e = Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: wr.join(" ").into(),
                raw: None,
            }));

            self.inside_tw = false;
        } else {
            e.visit_mut_children_with(self)
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor::new()))
}

fn setup_rule_map() -> CandidateValueMap {
    serde_json::from_str::<CandidateValueMap>(include_str!("./value.json")).unwrap()
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor::new()),
    boo,
    r#"let style = tw.flex.$lg(tw.bg_black$['20']).md(tw.important(tw.works).text_["18px"].text_["red-200"]).variant('&:nth-child(3)', tw.underline).raw("s-1/2")"#
);
