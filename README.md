# exo-dataset
Google BigQuery Dataset which deals with the creation and destruction of it's inner tables

[![NPM version](https://badge.fury.io/js/marked.png)][badge]

## Specs
### Ensure existency of a dataset

Once we have the datas which identify dataset we want to have it ready for use, so that we can ensure its existence writting code below

```
    var ds = new Dataset({
        projectId: "testing_project",
        datasetId: "dataset_name","
        auth: auth
    });

```

### Ensure existency of a dataset

```
    var ds = new Dataset({
        projectId: "project_id"
        datasetId: "dataset_id",
        auth: auth
    });

    var schema = {
        "fields": [
            { "name": "atcode", "type": "STRING", "mode": "REQUIRED" }
    ]};

    ds.ensure(function(err) {
        if ( err ) {
            // Error treatement
            return;
        }

        ds.ensureTable("tablePrefix_", schema, function(err) {
        
            if ( err ) {
                // Error treatement
                return;
            }

            // If not error arose the table must exists

        });
    });
```

### JSON Key

```auth``` it's a [JSONKey][jsonkey] object likes follow:

```
    {
        "client_id" : "123456789-riv50q4dklp935ce1s73le4i9c8280g8.apps.googleusercontent.com",
        "type" : "service_account",
        "private_key_id" : "abcdefghijklmnopkrstuvwxyz12345678901234",
        "client_email" : "123456789-asdfghjkqwertyui123456789c8280g8@developer.gserviceaccount.com",
        "private_key" : "-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMA/1Ck5SFUtsnnb\nmPg6ZxIm9O1bAwLxbdKkFTi6pftCbFeBCZeDuHp/xXROaD6+jG3LpCFa7z9WO3KC\nG9djgLXpPDkyryzL79+Y/pRsTK8FT0tBkseY+WPXwFRH0BzAWnugJh/VMg9rmDCJ\nArh0O7ojASdUZVGQ9J3RxcAFuyrzAgMBAAECgYEAp5u+a8ZeMqzpimYS4m+Ahwnh\nxcHwSTOVrOyS9+d6aCmL7Wo5o5gaUOpuiq0FI5bbNaoySUZPiaezomyeu1Ur02ln\nxQR3WPXFaC4P6kzH+WrjYbtKOJj9o09VtHM+B69TFAeOBKba5EX4UC5trB45Z1GY\n8yVZsGMj2BI3xYXvK7kCQQDtxQtlECxkivCEnx1raziASXhUsButY1e2DOO+T2+g\nEP6G38rKRwJJ/MNpO1MSJVj5KbyCCWzSrGNsnkZCeRyHAkEAzv1O34S5hJwVh14x\n/ODhLprD2sMe5HKcLtncSbUslIUr2OURyFYLSTPrA0QSQfXPA+abcdefgGVT5vC8\nCyFlNQJAKCxPxY6bAY3cH3xG2zxteabcdfghijklmnopqrkstuvwxy+zEsQ2pcuY\nNLJ6UamPw+GCYTI4cev4rIR9eIPABwJAUNAfIi9ciwSxdxd0pslZwWtVOizh+8kv\nZy9RzUk57YaM1vKgXboST/NANxc1laEVwO+1mmiyVKUG++xTTnksXQJAflWeu+mn\nFiW98+J1iiXIaG4QVxahiFCQl2uQdfE/8jG5qTXFqJ0RrFIR1HkRvUrslTTZcyM8\ngcKVuYOgAiRnpw==\n-----END PRIVATE KEY-----\n"
    }
```

[badge]: https://www.npmjs.com/package/exo-dataset
[jsonkey]: https://cloud.google.com/storage/docs/authentication#service_accounts
