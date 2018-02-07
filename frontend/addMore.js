var i = 8;
var colors = ["w3-text-blue", "w3-text-gray", "w3-text-green", "w3-text-black",
                            "w3-text-orange", "w3-text-red", "w3-text-yellow"];

function showOld(){
        var appendFields1 = '<tr>';
        appendFields1 +='<td><i class="fa fa-user ' + colors[(i-1)%7] + ' w3-large"></i></td>';
        appendFields1 +='<td>User '+ i +'</td>';
        appendFields1 +='<td><input type="number" name="user_data" class="w3-input w3-transparent" placeholder="Voted value"></td>';
        appendFields1 +='<td><input type="number" name="user_bid" class="w3-input w3-transparent" placeholder="Amount bided"></td>';
        appendFields1 += '</tr>';
        $("#tableo").append(appendFields1);
        i++;
}
