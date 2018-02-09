var i = 8;
var users_won = 0;
var colors = ["w3-text-blue", "w3-text-gray", "w3-text-green", "w3-text-black",
                            "w3-text-orange", "w3-text-red", "w3-text-yellow"];
var m_user_bids;
// before submitting
function addMoreUsersForInput(){
        var appendFields1 = '<tr>';
        appendFields1 +='<td><i class="fa fa-user ' + colors[(i-1)%7] + ' w3-large"></i></td>';
        appendFields1 +='<td>User '+ i +'</td>';
        appendFields1 +='<td><input type="number" name="user_data[]" class="w3-input w3-transparent" placeholder="Voted value"></td>';
        appendFields1 +='<td><input type="number" step="0.001" name="user_bid[]" class="w3-input w3-transparent" placeholder="Amount bided"></td>';
        appendFields1 += '</tr>';
        $("#tableo").append(appendFields1);
        i++;
}

//after response
function addUserStats(data)
{
    var wonLostRatio = 0;
    if (data.prizePercentiles.length != 0){
         wonLostRatio = data.winners.length/data.prizePercentiles.length;
    }
    displayWonUsers(data);
    displayWonLostStats(wonLostRatio);
}

function displayWonUsers(data)
{
    var total_prize = data.totalPrize;
    $("#totalPrizeHTML").text('(total prize for winners = ' + total_prize + ')');
    for (array_index in data.winners){
        var user_index = data.winners[array_index] +1;
        var user_data_percentile = data.prizePercentiles[user_index-1];
        var amount_bid = parseFloat(m_user_bids[user_index-1]);
        var final_money = amount_bid+total_prize*user_data_percentile;
        var final_percentage = (final_money - amount_bid)/amount_bid*100;
        var to_append = '<tr>';
        to_append += '<td>User ' + user_index + '</td>';
        to_append += '<td>' + m_user_bids[user_index-1] + '</td>';
        to_append += '<td>' + total_prize + '*' + (user_data_percentile).toFixed(3) + '</td>';
        to_append += '<td>' + final_money.toFixed(3) + '</td>';
        to_append += '<td style="color:green"> &#8657;' + (final_percentage).toFixed(3) + '%</td>';
        to_append += '</tr>';
        $("#user_profits").append(to_append);
    }
}

function displayWonLostStats(ratio)
{
    $("#num_users_won").css('width', Math.round(ratio*100) + '%');
    $("#num_users_won").text(Math.round(ratio*100) + '%');
    $("#num_users_lost").css('width', Math.round(100 - ratio*100) + '%');
    $("#num_users_lost").text(Math.round(100 - ratio*100) + '%');
}
//sending request
function sendData()
{
    $("#user_profits").empty();
    var source_data_values = [];
    $("input[name='source_data[]']").each(function() {
        source_data_values.push($(this).val());
    });
    var user_data_values = [];
    $("input[name='user_data[]']").each(function() {
        user_data_values.push($(this).val());
    });
    var user_bid_values = [];
    $("input[name='user_bid[]']").each(function() {
        user_bid_values.push($(this).val());
    });

    m_user_bids = user_bid_values;

    var formData = new FormData();
    formData.append('source_data', 'source_data_values');
    var d = '{"source_data":["' + source_data_values.join('","') + '"],"user_data":["' + user_data_values.join('","') + '"],"user_bid":["' + user_bid_values.join('","') + '"]}';
    // event.stopPropagation();
    // event.preventDefault();
    // alert(formData.get('source_data'));
    $.ajax({
      url: '/api/validate',
      dataType: 'json',
      data: d,
      contentType: "application/json",
        charset: "utf-8",
      // data: {'source_data':source_data_values }.serialize(),
      // data: formData,
      // processData: false,
      // contentType: false,
      type: 'POST',
      success: function(data) {
        console.log(data);
        addUserStats(data);
      }
    });
    return false;
  // });
}
