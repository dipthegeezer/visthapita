# visthapita

Database migration framework for node.js

## Installation

    $ npm install -g visthapita
or

    $ npm install visthapita

## Usage

```
Usage: visthapita [up|down|new] migrationName [options]

Options:
  --env, -e             The environment to run the migrations under.    [default: NODE_ENV]
  --migrations-dir, -m  The directory containing your SQL migration files.  [default: "./migrations/."]
  --verbose, -v         Verbose mode.                                   [default: false]
  --config              Location of the database.json file.             [default: "./config/*.yaml"]

```

## Creating Migrations

    $ visthapita create add-users

This will create a two files ./migrations/up/<datestamp>_add-users.sql and ./migrations/down/<datestamp>_add-users.sql.

All you have to do is populate these with your SQL Command and you are ready to migrate.

For example in up/add-users.sql:

CREATE TABLE users( id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL );

and in down/add-users.sql

DROP TABLE users

Then just run the migration

    $ visthapita up [add-users]

IF there is a problem then rollback. Note if you don't supply a name it will rollback the last migration that was run.

    $ visthapita down [add-users]

## Why yet another migration tool?

K.I.S.S.
All the others seem to be far to complicated, creating an api that you have to learn. You should be able to
run the pure SQL in order to migrate. Moreover as a developer you should be aware of what is happening
at the database level. Abstracting SQL away I believe leads to programmers having no idea about the
implications of the schema they are creating. A good developer needs to be multilingual.


## License

(The MIT License)

Copyright (c) 2011 dipthegeezer

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
