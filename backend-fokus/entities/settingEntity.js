const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name: "Setting",
    tableName: "settings",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        referal:{
            type:"varchar",
            length:100,
            nullable:true
        },
        instagram:{
            type:"varchar",
            length:100,
            nullable:true
        },
        link_instagram:{
            type:"varchar",
            length:100,
            nullable:true
        },
        no_wa:{
            type:"varchar",
            length:100,
            nullable:true
        },
        gmail:{
            type:"varchar",
            length:100,
            nullable:true
        },
        tiktok:{
            type:"varchar",
            length:100,
            nullable:true
        },
        youtube:{
            type:"varchar",
            length:100,
            nullable:true
        },
        created_at:{
            type:"timestamptz",
            default:()=> "CURRENT_TIMESTAMP",
            createDate:true
        },
        updated_at:{
            type:"timestamptz",
            onUpdate:()=> "CURRENT_TIMESTAMP",
            updateDate:true,
            nullable:true
        },
        is_deleted: {
            type: "boolean",
            default: false
        }
    },
})