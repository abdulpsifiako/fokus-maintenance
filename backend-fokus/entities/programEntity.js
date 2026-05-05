const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name:"Program",
    tableName:"programs",
    columns:{
        id:{
            type:"int",
            primary:true,
            generated:true
        },
        properties:{
            type:"json",
            nullable:true,
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
        is_active:{
            type:"boolean",
            default:true
        },
        is_deleted:{
            type:"boolean",
            default:false
        }
    }
})