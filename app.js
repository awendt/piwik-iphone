$(function(){
  if (!($.cookie('install') && $.cookie('site'))) {
    jQT.goTo('#settings', 'slideup');
  }

  var reset_table = function() {
    $("#visits").html("<thead> \
      <tr> \
        <td></td> \
        <th>Besucher</th> \
      </tr> \
    </thead> \
    <tbody></tbody>");
    $("div.visualize").remove();
    $("#visitors_10days .loading").show();
  };

  var get_visitors = function(install, site, token) {
    var data_accessed = $.cookie('install')+$.cookie('token')+$.cookie('site');
    if ($("#visits").data('loaded') == data_accessed) { return; }
    reset_table();
    $.getJSON(install+
        "/?module=API&method=VisitsSummary.getVisits" +
        "&idSite="+ site + "&period=day&date=last10&format=json" +
        "&token_auth="+ token +"&jsoncallback=?", function(json) {
      $.each(json, function(key, value) {
        $('#visits tbody').append("<tr><th>"+key+"</th><td>"+value+"</td></tr>");
      });
      $("#visitors_10days .loading").hide();
      $("#visits").visualize({
        type: 'bar',
        barGroupMargin: 2,
        parseDirection: 'y',
        appendKey: false,
        appendTitle: false
      });
      $("#visits").addClass("accessHide");
      $("#visits").data('loaded', data_accessed);
    });
  };

  $('#querySites').click(function() {
    if ($("#install").val() === "") { return; }

    $.getJSON($("#install").val() +
        "/?module=API&method=SitesManager.getSitesWithViewAccess&format=json \
        &token_auth="+$("#token").val()+ "&jsoncallback=?", function(json) {
      $.each(json, function(key, site) {
        $("#site").append('<option value="'+ site.idsite +'">'+ site.name +'</option>');
      });
      $(".question3").show();
      $('#querySites').hide();
    });
  });

  $("#visitors_10days").bind('pageAnimationEnd', function(event, info) {
    if (info.direction == "out") { return; }
    get_visitors($.cookie('install'), $.cookie("site"), $.cookie("token"));
  });

  $("#save").click(function() {
    $.cookie('install', $('#install').val());
    $.cookie('token', $('#token').val());
    $.cookie('site', $('#site').val());
    jQT.goBack();
  });
});