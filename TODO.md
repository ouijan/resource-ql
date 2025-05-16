# TODO

## Document

- [ ] Organise typedoc using @group (instead of @category)
- [ ] Pattern Enabled by this library
- [ ] How it enables testing

## Implement

- [x] Adaptor pattern for backends (remove doc references to firestore)
- [x] Pass through `transactions`
- [ ] `.queryWith`
- [ ] `constraintsWith`
- [ ] Allow registration of custom nodes (Doc, Query etc). Incase people wan't
      to add additional functions. Convert the Adaptor interface into an
      abstract class that provides the constructors for each type

## Test

- [ ] ColResolver
- [ ] Col
- [ ] DocResolver
- [ ] Doc
- [ ] QueryResolver
- [ ] Query

# Stretch Goals

- [ ] LokiJS Adaptor and examples
- [ ] firebase Adaptor and examples
- [ ] firebase-admin Adaptor and examples
