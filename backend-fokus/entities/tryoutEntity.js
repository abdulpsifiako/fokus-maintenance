const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name: "TryOut",
    tableName: "try_out",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },      
        properties:{
            type: "jsonb",
            nullable: true
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