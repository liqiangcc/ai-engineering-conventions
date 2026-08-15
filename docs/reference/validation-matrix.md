# Automation Validation Matrix

| Concern | Source of Truth | Automated By | Evidence |
|---|---|---|---|
| operationId uniqueness | API metadata | Convention Checker | OP001 |
| UC uniqueness | code metadata | Convention Checker | UC001 |
| BR uniqueness | code/docs metadata | Convention Checker | BR001 |
| BR behavior | BR / AC | Business Rule Tests | JUnit report |
| Use Case flow | UC / AC | Use Case Tests | JUnit report |
| Port contract | Port contract | Contract Tests | test report |
| Layer dependency | architecture convention | ArchUnit | architecture report |
| HTTP behavior | API / AC | `.http` tests | HTTP report |
| historical bug | INC / correct behavior | regression case | before/after + CI |
| running deployment | release metadata | post-deployment verifier | version + smoke |
| navigation view | code/test metadata | generator | entrypoint map |

矩阵用于防止多个工具维护同一真相，也防止某个关注点没有验证责任人。
