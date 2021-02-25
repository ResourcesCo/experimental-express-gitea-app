# Default to GET

- request:
  - url: https://httpbin.org/get

# GET

- request:
  - url: https://httpbin.org/get
  - method: GET

# GET with header

- request:
  - url: https://httpbin.org/get
  - method: GET
  - headers:
    - Authorization: Bearer 1234567890
