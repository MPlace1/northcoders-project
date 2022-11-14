### Project for northcoders ###

in order to successfully use the two databases locally then two files need to be made:
- a '.env.test' file
- a '.env.development' file

These will need to have 
PGDATABASE=<databse_name_here>
entered in, with each each file having the correct database name enetered for that environment.
The database names can be found in 'db/setup.sql'