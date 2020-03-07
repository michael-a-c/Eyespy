mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    let rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    let rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    let initDb = '$MONGO_INITDB_DATABASE' ;
    let admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    db.createUser({user: rootUser, pwd: rootPassword, roles: ["readWrite"], db: initDb);
EOF