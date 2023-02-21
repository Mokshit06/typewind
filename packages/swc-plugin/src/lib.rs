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

fn inner_most_is_tw(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(ident) => ident.sym == *"tw",
        Expr::Member(member_expr) => inner_most_is_tw(&*member_expr.obj),
        Expr::Call(call_expr) => inner_most_is_tw(&*call_expr.callee.as_expr().unwrap()),
        _ => return false,
    }
}

// probably just be a visitor?
fn analyse_expr(v: &mut TransformVisitor, wr: &mut String, e: &Expr) {
    match e {
        Expr::Member(member_expr) => {
            let style = match &member_expr.prop {
                MemberProp::Ident(ident) => ident.sym.as_ref(),
                MemberProp::Computed(computed) => {
                    match computed.expr.as_lit().expect("Only literal values allowed") {
                        Lit::Str(str) => str.value.as_ref(),
                        _ => panic!("Only string literal values allowed"),
                    }
                }
                _ => panic!("Private values not allowed"),
            };

            wr.push_str(&format!("{}{} ", v.get_prefix(), style));

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

            let style = callee_member
                .prop
                .as_ident()
                .expect("callee can only be identifier")
                .sym
                .as_ref();

            if style == "variant" {
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

                analyse_expr(v, wr, &*args.get(1).expect("style not specified").expr)
            } else {
                v.cur_prefix.push(format!("{}:", style));

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
        if inner_most_is_tw(&e) && !self.inside_tw {
            self.inside_tw = true;

            let mut wr = String::new();
            analyse_expr(self, &mut wr, &e);

            *e = Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: wr.into(),
                raw: None,
            }));
        } else {
            e.visit_mut_children_with(self)
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor::new()))
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor::new()),
    boo,
    // Input codes
    r#"let style = tw.flex.items_center.md(tw.sm(tw.works).text_black)"#,
    // Output codes after transformed with plugin
    r#"let style = "items_center flex md:text_black md:sm:works ""#
);
