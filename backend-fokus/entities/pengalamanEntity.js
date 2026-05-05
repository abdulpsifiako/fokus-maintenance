const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema(
    {
        name: "PengalamanEntity",
        tableName: "pengalaman",
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
            imageUrl:{
                type:"text",
                nullable:true,
                default:""
            },
            link:{
                type:"text",
                nullable:true,
                default:""
            },
            is_active:{
                type:'boolean',
                nullable:true,
                default:true
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