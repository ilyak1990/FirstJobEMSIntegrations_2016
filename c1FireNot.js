function getNodes(response,value)
{
 
var get = rbv_api.evalXpath(response, value);
 if(get.item(0)!==null)
   {
  

var final = get.item(0).getNodeValue();
  return final;
   }
 else 
 {return 'N/A';}
    

}

function buildPayload() //this is standard accross all payloads
{
  
  //recipients are the basic recipients XML syntax
  //basic is envelope wrapped around all calls
  
  var basic = '<?xml version="1.0" encoding="UTF-8"?>'
basic +='<soapenv:Envelope  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"        xmlns:xsd="http://www.w3.org/2001/XMLSchema"        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body>'             
                                                           

var createNotification = '<initiateNotifications xmlns="http://www.mir3.com/ws">'
createNotification+= '<apiVersion>4.3</apiVersion><authorization>'
createNotification+= '<username>'+ '{!#SETTINGS.MIR_3_Username}' + '</username><password>'+ '{!#SETTINGS.MIR_3_Password}' + '</password>'; //change this per account 
createNotification+=  '</authorization>'
createNotification+=   '<initiateOneNotification><notification>'+ '{!name#text}'+'</notification> </initiateOneNotification></initiateNotifications>' //firing off by title


                  

                  
    basic+= createNotification + '</soapenv:Body></soapenv:Envelope>'
    
    
    
var response = rbv_api.sendJSONRequest('https://ca.mir3.com/services/v1.2/mir3', basic, 'POST', 'text/xml', null,null,null); 
  
  rbv_api.println(response)
  
 //var response = '<?xml version="1.0" encoding="UTF-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> <soapenv:Body> <response xmlns="http://www.mir3.com/ws"> <success>true</success> <initiateNotificationsResponse> <initiation> <notification>test</notification> <notificationReportUUID>041794ad-0003-3000-80c0-fceb55463ffe</notificationReportUUID> </initiation> </initiateNotificationsResponse> </response> </soapenv:Body> </soapenv:Envelope>'
  
var value = "/*/*/response/success/text()"

var success = getNodes(response,value) ///traverse the response to see if it was a success
  
  if(success=='true')
    {      

      var value = "/*/*/response/initiateNotificationsResponse/initiation/notificationReportUUID/text()"
 var uuid = getNodes(response,value); //get the UUID if it wasnt a success
      rbv_api.println(uuid)
      rbv_api.setFieldValue('message', {!id}, 'UUID', uuid) //set the uuid
       rbv_api.setFieldValue('message', {!id}, 'Error_Message', ' ') 
    }
  else 
    {
       var value = "/*/*/response/error/errorMessage/text()"
       
 var error = getNodes(response,value); //get the errror message 
      rbv_api.println(error)
      rbv_api.setFieldValue('message', {!id}, 'Error_Message', error) //save the error message
    }
  
    

}
 buildPayload();
