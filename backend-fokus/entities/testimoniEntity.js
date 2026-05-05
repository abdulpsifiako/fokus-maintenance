const { EntitySchema } = require("typeorm")

module.exports= new EntitySchema({
    name:"Testimoni",
    tableName:"testimoni",
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
        status:{
            type:'boolean',
            default:false
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