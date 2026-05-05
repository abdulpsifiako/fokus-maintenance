const { EntitySchema } = require("typeorm")

module.exports= new EntitySchema({
    name:"SyaratKetentuan",
    tableName:"syaratketentuan",
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true
        },
        properties:{
            type:"jsonb",
            nullable:true
        },
        created_at:{
            type:"timestamptz",
            nullable:true
        },
        updated_at:{
            type:"timestamptz",
            nullable:true
        },
        is_active:{
            type:'boolean',
            default:false
        },
        is_deleted:{
            type:'boolean',
            default:false
        }
    }
})