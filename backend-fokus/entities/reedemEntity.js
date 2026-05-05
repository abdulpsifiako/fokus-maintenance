const { EntitySchema } = require("typeorm");

module.exports= new EntitySchema({
    name: "RedeemCode",
    tableName: "redeem_code",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nama:{
            type:"text",
            nullable:true
        },
        email:{
            type:"text",
            nullable:true
        },
        kode:{
            type:'text',
            nullable:true
        },
        detail_user:{
            type:"jsonb",
            nullable:true
        },
        jumlah_total:{
            type:"int",
            nullable:true
        },
        jumlah_pengajuan:{
            type:"int",
            nullable:true
        },
        sisa:{
            type:"int",
            nullable:true
        },
        status:{
            type:"varchar",
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