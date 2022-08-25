import React,{ useState } from "react";
import jsonImage from "./image.png";
import "./App.css"

const App = () => {
    var fileName;
    var status = {};

    const getStatus = () => {
          const url = "http://localhost:8181"
          const endPoint = "/api/v1/orders/csv/"
  
          var requestOptions = {
            method: 'GET'
          };
  
          fetch(url+endPoint+fileName, requestOptions)
            .then(response => {return response.text()})
            .then(data => {
              status = JSON.parse(data)
              console.log("Polling Response",data)
              // status = data
              var myDiv = document.getElementById("status");
              myDiv.innerHTML = "";

              if (Object.keys(status['data']['success']).length !== 0){
                const a = document.createElement('table');
                const successHead = document.createElement('caption');
                successHead.innerHTML = 'Success';
                a.appendChild(successHead);

                const q = document.createElement('tr');
                const w = document.createElement('th');
                w.innerHTML = 'Status Code';
                const e = document.createElement('th');
                e.innerHTML = 'Status';
                const r = document.createElement('th');
                r.innerHTML = 'Message';
                q.appendChild(w);
                q.appendChild(e);
                q.appendChild(r);

                a.appendChild(q);
                for (const property in status['data']['success']) {
                  const w = document.createElement('td');
                  w.innerHTML = JSON.stringify(property);

                  const e = document.createElement('tr');
                  const r = document.createElement('td');
                  const t = document.createElement('td');
                  const y = document.createElement('td');
                  var x = status['data']['success'][property];
                  r.innerHTML = x['Status Code'];
                  t.innerHTML = x['Status'];
                  y.innerHTML = x['Message'];

                  e.appendChild(r)
                  e.appendChild(t)
                  e.appendChild(y)

                  a.appendChild(w)
                  a.appendChild(e)
                }
                myDiv.appendChild(a)
              }

              if (Object.keys(status['data']['failed']).length !== 0){
                const b = document.createElement('table');
                const failedHead = document.createElement('caption');
                failedHead.innerHTML = 'Failed';
                b.appendChild(failedHead);

                const g = document.createElement('tr');
                const h = document.createElement('th');
                h.innerHTML = 'Status Code';
                const j = document.createElement('th');
                j.innerHTML = 'Status';
                const k = document.createElement('th');
                k.innerHTML = 'Message';
                g.appendChild(h);
                g.appendChild(j);
                g.appendChild(k);

                b.appendChild(g);
                for (const property in status['data']['failed']) {
                  const w = document.createElement('td');
                  w.innerHTML = JSON.stringify(property);

                  const e = document.createElement('tr');
                  const r = document.createElement('td');
                  const t = document.createElement('td');
                  const y = document.createElement('td');
                  var x = status['data']['failed'][property];
                  
                  r.innerHTML = x['Status Code'];
                  t.innerHTML = x['Status'];
                  y.innerHTML = x['Message'];

                  e.appendChild(r)
                  e.appendChild(t)
                  e.appendChild(y)

                  b.appendChild(w)
                  b.appendChild(e)
                }
                myDiv.appendChild(b)
              }
            })
            .catch((error) => {console.log(error)})
        }

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

        myHeaders.append("tenanttoken", TenantToken);
        myHeaders.append("accountnumber", Accountnumber);
        myHeaders.append("businessname", BusinessName);
        myHeaders.append("serviceid", ServiceId);
        myHeaders.append("servicetype", Servicetype);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        
        fetch('https://rara-ms-oms-brs.dev.rara.delivery/api/v1/orders/presigned', requestOptions)
          .then(response => {return response.text()})
          .then((data) => { const resp = JSON.parse(data)
            console.log("DAS",resp)
            fileName = resp.data.file
            console.log("State",fileName)
            // console.log("File",text)
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
              .then(response => {
                response.text()
                getStatus()
              })
              .catch((error) => {console.log(error)})
          })
          .catch((error) => {console.log(error)})
      };
    };

    return (
        <div>
          <div className="flex-container block">
            <div className="flex-container block outerDiv">
              <img src={jsonImage}></img>
              <h3>Upload CSV file here</h3>
              <input accept=".csv, text/csv, application/csv, text/comma-separated-values, application/csv" type="file" id="file" className="file" onChange={uploadFile}/>
              <button onClick={getStatus}>Update Status</button>
            </div>
            <div id="status" className="flex-container block status">
            </div>
          </div>
        </div>
    );
};

export default App;