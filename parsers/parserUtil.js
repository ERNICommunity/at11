module.exports.removeMetrics = function(item){
    return item.replace(/([0-9,]+ *\/?)+[gl]\.? ?/g,"")
}