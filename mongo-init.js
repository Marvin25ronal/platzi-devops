db.createUser(
    {
        user: "isoftste",
        pwd: "isoftste2022",
        roles: [
            {
                role: "readWrite",
                db: "sslverifier"
            }
        ]
    }
);