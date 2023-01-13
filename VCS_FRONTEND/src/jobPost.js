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
  console.log(json);
var allArray=json;

for (var i = 0; i < allArray.length; i++) {
  var details = allArray[i];
  const json = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title":  details.job_title,
    "description": details.job_description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "Vish Consulting Services",
      "value": "10"
    },
    "datePosted":  details.job_post_date,
    "validThrough": "2022-07-18T00:00",
    "applicantLocationRequirements": {
      "@type": "Country",
      "name":  details.country
    },

    "employmentType":  details.job_type_name,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Vish Consulting Services",
      "sameAs": "https://vishusa.com/"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality":  details.city,
        "addressRegion":  details.state,
        "addressCountry":  details.country
      }
    },
    "jobLocationType": "TELECOMMUTE",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value":  details.regular_pay_rate,
        "unitText": "HOUR"
      }
    }
  };
  console.log(json);
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(json);
  document.body.appendChild(script);
}
});
