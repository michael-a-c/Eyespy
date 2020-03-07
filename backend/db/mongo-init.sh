mongo -- "admin" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var dbToCreate = '$MONGO_INITDB_DATABASE';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);
    use $MONGO_INITDB_DATABASE;
    db.createUser({user: rootUser, pwd: rootPassword, roles: ["readWrite"]});

EOF