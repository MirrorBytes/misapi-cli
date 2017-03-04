# MiSapi CLI
Simple CLI for rapid deployment of a minimalistic, and secure, API.

# Install
```
npm install -g misapi-cli
```

# Usage
First, navigate to the folder in which you're storing the API.
Second:
```
misapi create <apiName>

Options:
  --help           Show help
  --version,  -v   Application version
  --desc,     -d   (optional) Application description
  --author,   -a   Application author
```
The above is the command to create you base API.

Next, you'll want to add some routes (because what's an API without routes?):
```
misapi add-route <routeName>

Options:
  --help         Show help
  --nomodel, -n  (optional) Will not create model in association with route.
```

There's a twist to the above command; you can create a model in association with it. If you'd like to create standalone routes, then use the `-n` option.
After creation of route, make sure to locate it in the routes directory, and add some logic to it!

What if you want standalone models? Here:
```
misapi add-model <modelName>

Options:
  --help         Show help
```

There are no options for model due to the file construction; the form was the most logical solution.
