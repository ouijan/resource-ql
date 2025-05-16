<div style="text-align: center;">
[![Build Status](https://github.com/ouijan/resource-ql/actions/workflows/build.yml/badge.svg)](https://github.com/ouijan/resource-ql/actions/workflows/build.yml)
[![Tests](https://github.com/ouijan/resource-ql/actions/workflows/tests.yml/badge.svg)](https://github.com/ouijan/resource-ql/actions/workflows/tests.yml)
[![Coverage](https://ouijan.github.io/resource-ql/coverage/coverage.svg)](https://ouijan.github.io/resource-ql/coverage/lcov-report)
[![Documentation](https://ouijan.github.io/resource-ql/docs/coverage.svg)](https://ouijan.github.io/resource-ql/docs)
</div>

<hr>

# ResourceQL

A type-safe, composable abstraction layer for document and collection APIs in TypeScript. Designed to provide a predictable, testable, and maintainable interface for data access—especially in large-scale applications—while supporting flexible adapters for different backends.

## 🚀 Features

- 🔨 Build re-usable and composable firestore accessors
- 🧱 Fluent query and collection builders
- 🔗 Relationship resolvers for nested documents and sub-collections
- ✅ Strong typing for documents, collections, and queries
- 🔁 Observable support for real-time updates

## 💻 Example

```ts
class Patient {
    // Create a "resource" resolver
    static resource = Resource.from<IPatient>();

    // Build queries by "extending" that resource
    static invoices = patient.subCol<IInvoice>("invoices");
}

// Access data
const patientRef: DocumentReference<IPatient> = ...
const patient = await Patient.resource.get(patientRef);
const invoices$ = Patient.invoices.get$(patientRef);
```

## Summary of Use Cases

| Key concepts |                                                           |
| ------------ | --------------------------------------------------------- |
| Resolvers    | Callable Classes that resolve a resource given a ref      |
| Extenders    | Functions called to build queries by extending a resource |
| Accessors    | Functions called to access data from a resource.          |

&nbsp;

| Interface              | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `IDoc<T>`              | Wraps a document with common accessors      |
| `IDocResolver<S, T>`   | Build scoped queries from a source document |
| `IQuery<T>`            | Wraps a query with common accessors         |
| `IQueryResolver<S, T>` | Build scoped queries from a source document |
| `ICol<T>`              | Wraps a collection with common accessors    |
| `IColResolver<S, T>`   | Build scoped queries from a source document |

## Advanced Queries

Extending a resource will return a new resource leaving the original unaffected

```ts
const res = Resource.from<IPatient>();
const resInvoices = res.subCol('invoices');
// res != resInvoices
```

Extending a collection will hold a reference to last collection ref, rather than returning a query. This us useful for maintaining some collection accessors.

```ts
const invoices = Resource.from<IPatient>()
  .subCol('invoices') // collection extender called here
  .constraints(where('status', '==', 'draft'));
const invoiceColRef = invoices.ref; // available

const invoices = Resource.from<IPatient>().query((patientRef) =>
  // query constructed directly with firestore
  patientRef.collection('invoice').where('status', '==', 'draft')
);
// invoices.ref is NOT available because a query was created directly
```

In some cases it may be useful add constraints to query/collection on the spot. Most accessors will allow this.

```ts
const res = Resource.from<IPatient>();
const resInvoices = res.subCol('invoices');
// later when used...
resInvoices.get(patientRef, where('draft', '==', true));
```
