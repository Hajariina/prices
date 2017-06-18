/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

              _   _  ___  ____          ___  _____ 
             | | | ||_ _||  _ \        |_ _||_   _|
             | |_| | | | | |_) | _____  | |   | |
             |  _  | | | |  __/ |_____| | |   | |
             |_| |_||___||_|           |___|  |_|
 
   
        (c) Concept, vormgeving, ontwerp en uitvoering
         ~~ HIP-IT BV (Media Laboratory) Amsterdam ~~
           Tel. +31-(0)20-617 02 82, info@hip-it.nl
                        www.hip-it.nl

(c) 1999-2008 HIP-IT Media Produkties BV
(c) Redouan Salmoun

All rights reserved! Alle rechten voorbehouden. Niets uit deze uitgave
mag zonder voorafgaande schriftelijke toestemming van HIP-IT
verveelvoudigd en/of openbaar worden gemaakt!

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
AttachEvent(document, 'keydown', checkEsc, false);var ajaxpr = newpost = ttid = false;rubriekenchecked = new Array();

function initTGCode()
{
  if (document.getElementById('picviewer'))
  {
    $('#tabblad').show();
    Galleria.loadTheme(media['static'] + '/trouwgids/src/galleria.classic.js');
    $('.picviewer').galleria();
  }
  
  if (document.getElementById('comments'))
  { 
    SWFAddress.addEventListener(SWFAddressEvent.CHANGE, haalBerichtenSWFAddress);
    AttachEvent(window, 'load', renderMedia, false);
  }
  if (document.getElementById('postform'))
  {
    haalBBcodeKnopjes('bericht');
  }
}

function check_bestelling(formulier)
{
  var go = false;
  for (a = 0; a < allerubrieken.length; ++a)
  {
    if (formulier['rid[' + allerubrieken[a] + ']'].checked == true)
    {
      if (formulier['interval[' + allerubrieken[a] + ']'].value)
      {
        go = true;
      }
    }
    else
    {
      formulier['interval[' + allerubrieken[a] + ']'].selectedIndex = '-1';
    }
  }
  
  if (go == true)
  {
    return true;
  }
  else
  {
    writer('error_report', 'Selecteer minimaal &eacute;&eacute;n rubriek en de duur van de advertentie');
    return false;
  }
}

function toonReacties()
{
	if ($("#postcontainer").is(":hidden"))
	{  
	  $(".galleria-image").fadeOut('fast');
	  $("#picviewer").slideUp('', function(){$('#postcontainer').slideDown('slow')});
	  $('#tabblad').css('background-position', '-126px -40px');
	}
}

function toonFotos()
{
  if ($("#picviewer").is(":hidden"))
	{  
  	$("#postcontainer").slideUp('', function(){$('#picviewer').slideDown('slow', function(){$('.galleria-image').fadeIn('fast')})});
  	$('#tabblad').css('background-position', '-126px -10px');
  }
}

function haalBerichten(tid, totals, pagenumber)
{
  writer('pagenavt', showLoader(1));
  writer('pagenavb', showLoader(1));
  haalData('GET', '/index.php?nav=getcomments&tid='+tid+'&totals='+totals+'&pagenumber='+pagenumber, 'toonPost', null);
  SWFAddress.setValue('?p=' + pagenumber);
}

function verwijderBericht(pid, trid, totals, pagenumber)
{
  if (confirm('Weer je zeker dat je dit bericht wilt verwijderen?'))
  {
    writer('pagenavt', showLoader(1));
    writer('pagenavb', showLoader(1));
    haalData('GET', '/cp.php?nav=delcomment&pid='+pid+'&trid='+trid+'&totals='+totals+'&pagenumber='+pagenumber, 'toonPost', null);
    --totals;
    maxpages = Math.ceil(totals/15);
    if (pagenumber > maxpages)
    {
      --pagenumber;
    }
    SWFAddress.setValue('?p=' + pagenumber);
  }
}

function haalBerichtenSWFAddress(event)
{
  if (ajaxpr == false)
  {
    var pagenumber;

    if (pagenumber = event.parameters.p)
    {
      haalBerichten(ttid, ttotals, pagenumber);
      toonReacties();
    }
  }
}

function plaatsBericht(formulier)
{
  if (formulier.bericht.value.length < 15)
  {
    alert('Bericht is te kort');
    formulier.submitbutton.value = 'verstuur';
    formulier.submitbutton.disabled = false;
  }
  else if (formulier.bericht.value.length > 5000)
  { 
    alert('Bericht is te lang');
    formulier.submitbutton.value = 'verstuur';
    formulier.submitbutton.disabled = false;
  }
  else
  { 
    poststr = 'nav=newcomment&bericht='+escape(formulier.bericht.value)+'&tid='+formulier.tid.value+'&trid='+formulier.trid.value+'&totals='+formulier.totals.value;
    haalData('POST', '/index.php', 'toonPost', poststr);
    newpost = true;
  }
}

function toonPost(Aanvraag)
{
  if (Aanvraag.substr(5, 4) == 'MSGL' || Aanvraag.substr(5, 4) == 'MSGR')
  {
    alert(Aanvraag.substr(13));
    window.location.reload();
  }
  else
  {
    writer('posts', Aanvraag);
    if (document.getElementById('postform'))
    {
      cpostform.submitbutton.value = 'verstuur';
      cpostform.bericht.value = '';
      cpostform.submitbutton.disabled = false;
    }
    if (newpost == true)
    {
      ss('postform');
      newpost = false;
    }
    else
    {
      ss('posts');
    }
    renderMedia();
  }
}

function playYoutube(divje, video, width)
{
  youtubeplayer = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + width + '" height="350">';
  youtubeplayer = youtubeplayer + '<param name="src" value="http://www.youtube.com/v/'+video+'" />';
  youtubeplayer = youtubeplayer + '<param name="menu" value="false" />';
  youtubeplayer = youtubeplayer + '<param name="wmode" value="transparent" />';
  youtubeplayer = youtubeplayer + '<embed src="http://www.youtube.com/v/'+video+'" menu="false" wmode="transparent" width="' + width + '" height="350" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>';
  writer(divje, youtubeplayer);
}

function renderMedia(herhaal)
{
  var imgs = document.getElementById('comments').getElementsByTagName('img');
  div = 500;
  for (var i = 0; i < imgs.length; i++)
  {  
    if (imgs[i].width > div)
    {
      imgs[i].style.width = div+'px';
      imgs[i].style.cursor = 'pointer';
      imgs[i].style.border = 'dotted #FF0000 2px';
      imgs[i].style.margin = '0px 0px 5px 0px';
      imgs[i].title = 'Klik hier voor een groter plaatje';
      imgs[i].onclick = function(){openVenster(this.src, 'foto', 0);}
    }
  }
  
  var vidsobject = document.getElementById('comments').getElementsByTagName('object');
  for (var i = 0; i < vidsobject.length; i++)
  {
    if (!vidsobject[i].classid)
    {
      var filmpje = vidsobject[i].name.substr(4);
      var divje = vidsobject[i].name.substr(0, 4);
      playYoutube('youtube'+divje, filmpje, div+3);
    }
  }
}

function haalBBcodeKnopjes(textareatemp)
{
  var myTags = new Array();
  myTags[0] = new Array('idubb_strong','strong','VET','[B]','[/B]');
  myTags[1] = new Array('idubb_italic','italic','CURSIEF','[I]','[/I]');
  myTags[2] = new Array('idubb_underline','underline','ONDERSTREPEN','[U]','[/U]');
  myTags[3] = new Array('idubb_quote','quote','CITAAT','[QUOTE]','[/QUOTE]');
  myTags[4] = new Array('idubb_left','left','LINKS UITLIJNEN','[LEFT]','[/LEFT]');
  myTags[5] = new Array('idubb_center','center','CENTREREN','[CENTER]','[/CENTER]');
  myTags[6] = new Array('idubb_right','right','RECHTS UITLIJNEN','[RIGHT]','[/RIGHT]');
  myTags[7] = new Array('idubb_justify','justify','UITVULLEN','[JUSTIFY]','[/JUSTIFY]');
  myTags[8] = new Array('idubb_list','list','OPSOMMING','[LIST]','[/LIST]');
  myTags[9] = new Array('idubb_listnum','listnum','NUMMERING','[LIST=1]','[/LIST]');
  myTags[10] = new Array('idubb_url','url','LINK','[URL]','[/URL]');
  myTags[11] = new Array('idubb_img','img','PLAATJE','[IMG]','[/IMG]');
  myTags[12] = new Array('idubb_youtube','youtube','YOUTUBE VIDEO','[YOUTUBE]','[/YOUTUBE]');

  var taglength = myTags.length-1;
  var bbformbuttons = '';
  for (i = 0; i <= taglength; i++)
  {
    //bbformbuttons = bbformbuttons + '<input type="button" class="formbutton" id="' + myTags[i][0] + '" onMouseOver="this.className=\'formbutton formbuttonover hand\'" onMouseOut="this.className=\'formbutton hand\'" " onMouseDown="this.className=\'formbutton formbuttondown hand\'" style="background:url(\'' + media['static'] + '/img/bbicon/' + myTags[i][1] + '.gif\') no-repeat" name="' + myTags[i][1] + '" onClick="WriteOption(\'' + myTags[i][0] + '\',\''+textareatemp+'\',\'' + myTags[i][3] + '\',\'' + myTags[i][4] + '\');" title="' + myTags[i][2] + '" />';
    bbformbuttons = bbformbuttons + '<div class="floatl formbutton" id="' + myTags[i][0] + '" onMouseOver="this.className=\'floatl formbutton formbuttonover hand\'" onMouseOut="this.className=\'floatl formbutton hand\'" " onMouseDown="this.className=\'floatl formbutton formbuttondown hand\'" onmouseup="this.className=\'floatl formbutton formbuttonup hand\'" name="' + myTags[i][1] + '" onClick="WriteOption(\'' + myTags[i][0] + '\',\''+textareatemp+'\',\'' + myTags[i][3] + '\',\'' + myTags[i][4] + '\');"><img src="' + media['static'] + '/img/bbicon/' + myTags[i][1] + '.gif" alt="' + myTags[i][2] + '" width="22" height="22" /></div>';
  }
  bbformbuttons = bbformbuttons + '<div class="cleardiv"></div>';
  writer('divformbuttons', bbformbuttons);
}

function WriteOption (myButId, myText, tagOpen, tagClose)
{
  myText = document.getElementById(myText);

  mySelection = '';

  if (window.getSelection || document.getSelection)
  {
    mySelection = myText.value.substring(myText.selectionStart, myText.selectionEnd);
  }
  else
  {
    mySelection = iestr = document.selection.createRange().text;
  }
  
  Content = '';
  
  myButSwitch = myButId.substring(6,myButId.length);

  // -- LIST
  if ( myButSwitch == 'list' || myButSwitch == 'listnum' ) {
    Content = tagOpen + "\n";

		do {
		  tmpval = prompt("Geef een punt op voor de opsomming:","");
		  if ( tmpval != undefined && tmpval != '') {
		    Content += "[*]" + tmpval + "\n";
		  }
		} while (tmpval != null && tmpval != "" && tmpval != undefined);

		Content = Content + tagClose + "\n";
  }
  // -- URL
  else if ( myButSwitch == 'url') {
    tagOpen = tagOpen.substring(0,tagOpen.length-1);
    Content  = tagOpen;
    tmphref  = prompt("Locatie:","http://");
    tmptext  = '';

    if ( mySelection == '' ) {
      tmptext  = prompt("Locatie Tekst:","");
    }
    else {
      tmptext = mySelection;
    }

    if ( tmphref == null || tmphref == "" || tmphref == undefined ) { Content = Content + '="#"'; }
    else                                                            { Content = Content + '="' + tmphref + '"'; }

    if ( tmptext == null || tmptext == "" || tmptext == undefined ) {
      if ( tmphref != undefined && tmphref != '' ) {
        Content = Content + ']' + tmphref;
      }
      else {
        Content = Content + ']';
      }
    }
    else {
     Content = Content + ']' + '' + tmptext;
    }

    Content = Content + tagClose;
  }
  // -- IMG
  else if ( myButSwitch == 'img') {
    //tagOpen = tagOpen.substring(0,tagOpen.length-1);
    Content  = "[IMG]";
    tmphref  = prompt("Bron afbeelding:","");

    if ( tmphref == null || tmphref == "" || tmphref == undefined ) {
      Content = Content;
    }
    else {
     Content = Content + tmphref;
    }

    Content = Content + tagClose;
  }
  
  else if ( myButSwitch == 'youtube') {
    //tagOpen = tagOpen.substring(0,tagOpen.length-1);
    Content  = "[YOUTUBE]";
    tmphref  = prompt("Link YouTube video:","");

    if ( tmphref == null || tmphref == "" || tmphref == undefined ) {
      Content = Content;
    }
    else {
     Content = Content + tmphref;
    }

    Content = Content + tagClose;
  }
  
	var startPos = myText.selectionStart;
	var endPos = myText.selectionEnd;
	var cursorPos = endPos;
	var scrollTop = myText.scrollTop;

  if ( window.getSelection || document.getSelection ) {
    // Almost Mozilla or Opera
    if ( myText.selectionStart != myText.selectionEnd ) {
      if ( Content != '' ) {
        myText.value =
          myText.value.substring(0,myText.selectionStart)
        + Content
        + myText.value.substring(myText.selectionEnd,myText.value.length);

        cursorPos += Content.length - mySelection.length;
      }
      else {
       myText.value =
        myText.value.substring(0,myText.selectionStart)
        + tagOpen
        + myText.value.substring(myText.selectionStart,myText.selectionEnd)
        + tagClose
        + myText.value.substring(myText.selectionEnd,myText.value.length);

        cursorPos += tagOpen.length + tagClose.length;

      }
    }
    else {
      if ( Content != '' ) {
        myText.value =
          myText.value.substring(0,myText.selectionStart)
        + Content
        + myText.value.substring(myText.selectionEnd,myText.value.length);

        cursorPos += Content.length;
      }
      else {
      myText.value =
        myText.value.substring(0,myText.selectionStart)
      + tagOpen
      + myText.value.substring(myText.selectionStart,myText.selectionEnd)
      + tagClose
      + myText.value.substring(myText.selectionEnd,myText.value.length);

      cursorPos += tagOpen.length;

      }
    }

		myText.focus();
		myText.selectionStart = cursorPos;
		myText.selectionEnd = cursorPos;
		myText.scrollTop = scrollTop;
  }
  else if (document.selection) {
    // Almost suckzors
    myText.focus();
    iestr = document.selection.createRange();

    if ( iestr.text.length > 0 ) {
      if ( Content != '' ) {
        iestr.text = Content;
      }
      else {
        iestr.text = tagOpen + iestr.text + tagClose;
      }
    }
    else {
      if ( Content != '' ) {
        iestr.text = Content;
      }
      else {
        iestr.text = tagOpen + tagClose;
      }
    }
    myText.focus();
  }
}

function checkEsc()
{
  if (window.event.keyCode == 27)
  {
    if (document.getElementById('dialog'))
    {
      sluitDivPop();
    }
  }
}

function slide()
{
  if ($("#slidein").is(":hidden"))
  {
    $('#slidein').slideDown('fast')
  }
  else
  {
    $('#slidein').slideUp('fast')
  }
}

function checkConditionsTG()
{
  if (document.aanmelden.agree.checked != true)
  {
    //$('.voorwaarden').css('backgroundColor','#cf0200');
    //$('.voorwaarden').css('color','#ffffff');
    alert('Accepteer de voorwaarden om verder te gaan');
    return false;
  }
  else
  {
    return true;
  }
}

function toggleConditionsTG()
{
  if (document.aanmelden.agree.checked == true)
  { 
    $('.voorwaarden').css('backgroundColor','#E9E3D5');
    $('.voorwaarden').css('color','#6D6B7A');
    document.aanmelden.betalen.disabled = false;
  }
  else
  {
    document.aanmelden.betalen.disabled = true;
  }
}

function mailBedrijf(bid)
{
  openVenster('http://biz.marokko.nl/tools.php?' + SESSIONURL + 'nav=mailbedrijf&CMD=mail&bid=' + bid, 'mailbedrijf', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=440,height=350');
}

function printBedrijf(bid)
{
  openVenster('http://biz.marokko.nl/tools.php?' + SESSIONURL + 'nav=printbedrijf&CMD=print&bid=' + bid, 'printbedrijf', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=665,height=450');
}