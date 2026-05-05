const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema(
    {
        name: "InstagramEntity",
        tableName: "instagram",
        columns:{
            id:{
                type:"int",
                primary:true,
                generated:true
            },
            judul:{
                type:"varchar",
                length:255,
                nullable:true,
                default: ""
            },
            deskripsi:{
                type:"text",
                nullable:true,
                default: ""
            },
            link:{
                type:"text",
                nullable:true,
                default: ""
            },
            imageUrl:{
                type:"text",
                nullable:true,
                default:""
            },
            created_at:{
                type:"timestamp",
                default: () => "CURRENT_TIMESTAMP"
            },
            updated_at:{
                type:"timestamp",
                default: () => "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP"
            }
        }
    }
)