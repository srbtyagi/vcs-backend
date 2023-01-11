const obj = {
  s1: '',
  s2: '',
  s3: ''
};

fetch('https://vishusa.com/vcsapi/get/api/tbl/job/search_job/with/filter', {
  method: 'POST',
  body: JSON.stringify(obj),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho'
  }
}).then(response => response.json()).then(json => {
 var allArray=json;
for (var i = 0; i < allArray.length; i++) {
  var details = allArray[i];
  var findValidDate=new Date(details.job_post_date).toLocaleDateString('en-CA').split('-');
  var finalDate=''+(parseInt(findValidDate[0])+1) + '-'+findValidDate[1]+'-'+findValidDate[2];
   const json = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title":  details.job_title,
     "url": "https://vishusa.com/job-details?special="+details.job_id+"",
    "description": details.job_description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "vishusa.com",
      "value": ""+details.job_id+""
    },
    "datePosted":  new Date(details.job_post_date).toLocaleDateString('en-CA')+'T00:00:00',
    "validThrough": finalDate + 'T00:00:00',
      "employmentType": [
       "CONTRACTOR"
     ],
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Vish Consulting Services",
      "sameAs": "https://vishusa.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry":  details.country.slice(0,2),
        "addressLocality":  details.city,
        "addressRegion":  details.state
      }
    },
    "jobLocationType": "TELECOMMUTE",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value":   parseFloat(details.regular_pay_rate),
        "unitText": "HOUR"
      }
    },
     "directApply": false
  };
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(json);
  document.body.appendChild(script);
}
});



// "employmentType":  details.job_type_name,


// "applicantLocationRequirements": {
//   "@type": "Country",
//     "name":  details.country
// },
