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

        const TenantToken = "DevYadav"
        const BusinessName = "DevInc"
        const ServiceId = "DYID"
        const Accountnumber = "DY0512"
        const Servicetype = "MP"  
        const WebhookStr = `[{'purpose':["OR","OP","VO","VC"],"requestMethod":"POST","url":'https://envqm7h8tmior.x.pipedream.net',"headers":[{"key":"Key1","value":"BusinessHeader"},{"key":"Key2","value":"BusinessHeader"}],"payload":"tmpl-1"}]`

        myHeaders.append("Tenanttoken", TenantToken);
        myHeaders.append("Accountnumber", Accountnumber);
        myHeaders.append("Businessname", BusinessName);
        myHeaders.append("Serviceid", ServiceId);
        myHeaders.append("Servicetype", Servicetype);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        fetch('http://localhost:8181/api/v1/orders/csv', requestOptions)
          .then(response => {return response.text()})
          .then((data) => { const resp = JSON.parse(data)
            const requestOptions = {
              method: 'PUT',
              headers: {
                'x-amz-acl' : "public-read",
                'x-amz-meta-csv' : resp.data.file,
                'x-amz-meta-tenanttoken' : TenantToken,
                'x-amz-meta-businessname' : BusinessName,
                'x-amz-meta-serviceid' : ServiceId,
                'x-amz-meta-webhook' : WebhookStr
              },
              body: text
            };
            fetch(resp.data.presignedUrl, requestOptions)
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