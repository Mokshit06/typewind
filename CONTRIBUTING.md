# Contributing

## Bug fixes

If you've found a bug in Typewind that you'd like to fix, [submit a pull request](https://github.com/mokshit06/typewind/pulls) with your changes. Include a helpful description of the problem and how your changes address it, and provide tests so we can verify the fix works as expected.

## New features

If there's a new feature you'd like to see added to Typewind, [share your idea with us](https://github.com/mokshit06/typewind/discussions/new?category=ideas) in our discussion forum to get it on our radar as something to consider for a future release.

**Please note that we don't often accept pull requests for new features.** Adding a new feature to Typewind requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

## Running tests

You can run the test suite using the following commands:

```sh
cargo test
```

You can run update the test suite snapshot using the following command:

```sh
UPDATE=1 cargo test
```

To test the features you've added, run the following command:

```sh
npm run build
```

and then run each of the examples in `examples/*` to test that the changes are working as intended.

Please ensure that the tests are passing when submitting a pull request. If you're adding new features to Typewind's SWC plugin, please include tests.

## Debugging the WASM plugin

Typewind's SWC plugin is written in Rust and compiled to a WASM binary targeting `wasm32-wasip1` (WASI). Because the plugin uses the WASI target, standard Rust debugging macros like `println!()`, `eprintln!()`, and `dbg!()` are fully functional and will produce output.

### Adding debug output

Add `println!()`, `eprintln!()`, or `dbg!()` calls inside the visitor methods in `packages/typewind/swc/lib.rs`. For example:

```rust
impl VisitMut for TransformVisitor {
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        eprintln!("visiting expression: {:?}", e);
        // ...
    }
}
```

> **Note:** These macros work because the plugin targets `wasm32-wasip1`. They would be no-ops if the target were `wasm32-unknown-unknown`.

### Viewing logs during tests

By default, `cargo test` captures stdout and stderr and only shows them for failing tests. To see debug output from passing tests, use the `--nocapture` flag:

```sh
cargo test -- --nocapture
```

Make sure your debug prints are inside the visitor or transform logic (e.g. `TransformVisitor`'s `VisitMut` methods or `analyse_expr`), not inside the `#[plugin_transform]` entry point — the `test!()` macro invokes the visitor directly and does not call `process_transform`.

### Viewing logs at build time

When the plugin runs inside Next.js or another SWC-based bundler, WASI stdout/stderr output surfaces in the build terminal. Add temporary `eprintln!()` calls, rebuild the plugin:

```sh
cd packages/typewind
cargo build-wasi --release && cp target/wasm32-wasip1/release/typewind_swc.wasm dist
```

Then run the consuming project's build (e.g. `npm run dev` in one of the `examples/*` apps). Debug output will appear in the terminal alongside the normal build logs.

### Where to find snapshot test output

The SWC test snapshots live in:

```
packages/typewind/tests/__swc_snapshots__/swc/lib.rs/
```

If a test fails, the diff between expected and actual output is printed to the terminal. To update snapshots after intentional changes:

```sh
UPDATE=1 cargo test
```
