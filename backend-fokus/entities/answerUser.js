const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name: "AnswerUser",
    tableName: "answer_user",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        user_id:{
            type:"text",
            nullable:true
        },
        jenis:{
            type:'varchar',
            nullable:true
        },
        program_id:{
            type:'int',
            nullable:true
        },
        properties:{
            type: "jsonb",
            nullable: true
        },
        total_skor:{
            type: "int",
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