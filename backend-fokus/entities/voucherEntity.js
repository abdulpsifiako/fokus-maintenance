const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name: "Voucher",
    tableName: "voucher",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name:{
            type:"text",
            nullable:true
        },
        nilai:{
            type:'int',
            nullable:true
        },
        tipe:{
            type:"text",
            nullable:true
        },
        valid:{
            type:"timestamptz",
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