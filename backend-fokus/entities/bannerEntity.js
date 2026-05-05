const { EntitySchema } = require("typeorm");

module.exports=new EntitySchema({
    name:"Banner",
    tableName:'banner',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true
        },
        url:{
            type:'text',
            nullable:true,
            default:''
        },
    }
})