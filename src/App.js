import React from "react";
import jsonImage from "./image.png";
import "./App.css"

const App = () => {

    const uploadFile = (e) => {
      e.preventDefault();
      const reader = new FileReader();
      reader.readAsText(e.target.files[0])
      reader.onload = (e) => {
        const text = e.target.result;
        var myHeaders = new Headers();

        const TenantToken = "Das"
        const BusinessName = "Dasnic"
        const ServiceId = "DasID"
        const Accountnumber = "DAS121"
        const Servicetype = "MP"  
        //const WebhookStr = `[{'purpose':["OR","OP","VO","VC"],"requestMethod":"POST","url":'https://envqm7h8tmior.x.pipedream.net',"headers":[{"key":"Key1","value":"BusinessHeader"},{"key":"Key2","value":"BusinessHeader"}],"payload":"tmpl-1"}]`

        myHeaders.append("tenanttoken", TenantToken);
        myHeaders.append("accountnumber", Accountnumber);
        myHeaders.append("businessname", BusinessName);
        myHeaders.append("serviceid", ServiceId);
        myHeaders.append("servicetype", Servicetype);
       // myHeaders.append("webhook", WebhookStr);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        

        fetch('https://rara-ms-oms-brs.dev.rara.delivery/api/v1/orders/presigned', requestOptions)
          .then(response => {return response.text()})
          .then((data) => { const resp = JSON.parse(data)
            console.log("DAS",resp)

            console.log("File",text)
            const requestOptions = {
              method: 'PUT',
              headers: {
                'x-amz-acl' : "public-read",
                'x-amz-meta-tenanttoken' : resp.data.req.tenantToken,
                'x-amz-meta-businessname' : resp.data.req.businessDetails.businessName,
                'x-amz-meta-serviceid' : resp.data.req.businessDetails.serviceId,
                'x-amz-meta-servicetype' : resp.data.req.businessDetails.serviceType,
                'x-amz-meta-accountnumber' : resp.data.req.businessDetails.accountNumber,
                'x-amz-meta-webhook' : resp.data.webhook
              },
              body: text
            };

            fetch(resp.data.presigned_url, requestOptions)
              .then(response => console.log(response))
              .catch((error) => {console.log(error)})
          })
          .catch((error) => {console.log(error)})
      };
    };

    return (
        <div>
          <div className="flex-container block">
            <img src={jsonImage}></img>
            <h2>Upload CSV file here</h2>
            <input accept=".csv, .xls, .xlsx, text/csv, application/csv, text/comma-separated-values, application/csv, application/excel, application/vnd.msexcel, text/anytext, application/vnd. ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" type="file" id="file" className="file" onChange={uploadFile}/>
          </div>
        </div>
    );
};

export default App;