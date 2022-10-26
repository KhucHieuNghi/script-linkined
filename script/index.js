import './index.css';

function initAdd() {
  const formatUrn = (urn) => `urn:li:fsd_profile:${urn}`;


const scriptFormat = (la) => {

  const items = la.included.filter(item => item.topComponents?.length)

  const education = items.find(item => item.topComponents[0].components.headerComponent.title.text === 'Education')
  const eucation2 = education
  ?.topComponents
  .filter(item => !item.components.headerComponent && item.components.fixedListComponent)
  .map(item => {
      const edus = item.components.fixedListComponent.components.map(item2 =>
        {
          const asd = {
            title: item2?.components?.entityComponent?.title?.text || '',
            sub: item2?.components?.entityComponent?.subtitle?.text || '',
            range: item2?.components?.entityComponent?.caption?.text || ''
          }
          return {
            ...asd,
            text: `${asd.title} ${asd.sub} ${asd.range}`
          }
        }
      )
      return edus
  })

  const companies = items.find(item => item.topComponents[0].components.headerComponent.title.text === 'Experience')
  const companies2 = companies
    ?.topComponents
    .filter(item => !item.components.headerComponent && item.components.fixedListComponent)
    .map((item) => {
      const companies = item.components.fixedListComponent.components.map((item2) =>
        {
          const asd = {
            title: item2?.components?.entityComponent?.title?.text || '',
            sub: item2?.components?.entityComponent?.subtitle?.text || '',
            range: item2?.components?.entityComponent?.caption?.text ||''
          }
          return {
            ...asd,
            text: `${asd.title} ${asd.sub} ${asd.range}`
          }

        }
      )
      return companies
  })

  const certificate = items.find(item => item.topComponents[0].components.headerComponent.title.text === 'Licenses & certifications')
  const certificate2 = certificate
    ?.topComponents
    .filter(item => !item.components.headerComponent && item.components.fixedListComponent)
    .map((item) => {
      const certificates = item.components.fixedListComponent.components.map((item2) =>
        {
          const asd =  {
            title: item2?.components?.entityComponent?.title?.text || '',
            sub: item2?.components?.entityComponent?.subtitle?.text|| '',
            range: item2?.components?.entityComponent?.caption?.text || ''
          }
          return {
            ...asd,
            text: `${asd.title} ${asd.sub} ${asd.range}`
          }
        }
      )
      return certificates
  })

  return {
    certificate2: (certificate2 || []).flat(),
    companies2: (companies2 || []).flat(),
    eucation2: (eucation2 || []).flat(),
  }
}



  const getEntityUrn = (urlA) => {
  const url = new URL(urlA);

  if (!url.search) {
      return formatUrn(url.pathname.replace("/in/", ""));
  }

  const param = url.searchParams.get("facetConnectionOf");
  const ids = param.match(/\"(.*)\"/);
  return formatUrn(ids[1]);
  };
  const getEnUrn = (urlA) => {
  const url = new URL(urlA);

  if (!url.search) {
      return url.pathname.replace("/in/", "");
  }

  const param = url.searchParams.get("facetConnectionOf");
  const ids = param.match(/\"(.*)\"/);
  return ids[1];
  };

  function getInfoPeople(element, index) {
    const entityUrn = element.querySelector(
      ".app-aware-link.entity-result__simple-insight-wrapping-link"
  )?.href ||
      element.querySelectorAll(
      ".entity-result__simple-insight-text-container a.app-aware-link"
      )?.[2]?.href

      if(!entityUrn) return;

      const name = element.querySelector(
        "span.entity-result__title-text .app-aware-link > span > span"
        ).innerText

      const splitName = name.split(" ");

    try {
      return {
        lastName: splitName.length > 2 ? name.split(" ").pop() : (splitName?.[1] || splitName?.[0] || ''),
        firstName: name.split(" ").splice(0,2).join(' '),
        userLink: element
        .querySelector("span.entity-result__title-text .app-aware-link")
        .getAttribute("href"),
        entityUrn: getEntityUrn(entityUrn),
        profile: getEnUrn(entityUrn),
        headline: element.querySelector(".entity-result__primary-subtitle")
        .innerText,
        address: element.querySelector(".entity-result__secondary-subtitle")
        .innerText,
        pictures: element.querySelector(
        ".presence-entity.presence-entity--size-3 > img"
        ).src,
        isConnect:
        element.querySelector(".artdeco-button__text").innerText === "Connect",
        memberId: element
        .querySelector(".entity-result")
        .getAttribute("data-chameleon-result-urn"),
        description: element.querySelector('.entity-result__summary').innerText
    };
    } catch (error) {
      console.log('err', index)
    }
  }

  function postNoti({ fullName, entityUrn } = {}) {
      if(!fullName || !entityUrn) return null;

      const cookie = document.cookie.split(";").reduce((res, c) => {
          const [key, val] = c.trim().split("=").map(decodeURIComponent);
          const allNumbers = (str) => /^\d+$/.test(str);
          try {
          return Object.assign(res, {
              [key]: allNumbers(val) ? val : JSON.parse(val),
          });
          } catch (e) {
          return Object.assign(res, { [key]: val });
          }
      }, {});

      fetch(
          "https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreate",
          {
          headers: {
              accept: "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json; charset=UTF-8",
              "csrf-token": cookie.JSESSIONID,
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
          },
          referrer:
              "https://www.linkedin.com/search/results/people/?keywords=%22senior%22&page=3&sid=9Bx",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: `{\"inviteeProfileUrn\":\"${entityUrn}\",\"customMessage\":\"Hi ${fullName}\"}`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          }
      );
  }

  async function getSkill(id){
          const cookie = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=").map(decodeURIComponent);
            const allNumbers = (str) => /^\d+$/.test(str);
            try {
            return Object.assign(res, {
                [key]: allNumbers(val) ? val : JSON.parse(val),
            });
            } catch (e) {
            return Object.assign(res, { [key]: val });
            }
        }, {});

        const re = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:urn%3Ali%3Afsd_profile%3A${id},sectionType:skills,locale:en_US)&&queryId=voyagerIdentityDashProfileComponents.f4a0cf58899f5eb25faa8673666717ce`, {
        "headers": {
          "accept": "application/vnd.linkedin.normalized+json+2.1",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "csrf-token": "ajax:7697808159906382804",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-li-lang": "en_US",
          "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base_skills_details;kzP/Hm7uTqGaoaXOPV9dIQ==",
          "x-li-track": "{\"clientVersion\":\"1.11.2875\",\"mpVersion\":\"1.11.2875\",\"osName\":\"web\",\"timezoneOffset\":7,\"timezone\":\"Asia/Saigon\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":1,\"displayWidth\":1920,\"displayHeight\":1200}",
          "x-restli-protocol-version": "2.0.0",
          "cookie": `G_ENABLED_IDPS=google; liap=true; JSESSIONID=\"${cookie.JSESSIONID}\"; li_sugr=c590a8a5-5bcb-4427-995e-95d04c6eefa6; li_theme=light; li_theme_set=app; _gcl_au=1.1.1331885719.1648981767; timezone=Asia/Saigon; li_rm=AQFOSgXfEcZzjQAAAYH5UP010hI4zorQfsfJ4JneovX5rEr5Id2X3ylWI_W9urzi0thEWLfOpwy128A-w0lfqi0xsNt4DOacSI_rG6lZiscptKz9ibmkhD9U; bcookie=\"v=2&54ded92b-5bd9-45ab-848f-f5b314814215\"; bscookie=\"v=1&20220721172028fb993bd5-f5a8-4b17-8271-1abe706c5d2eAQEho4Xcs34ZpyWcHQPY1wguzSMa7Im1\"; _guid=bfbeedf5-334d-4847-96cb-1a373e54433f; s_fid=6432FE948834E872-1F739E5D40B3B71F; gpv_pn=developer.linkedin.com%2Fproduct-catalog; s_ips=948; s_tp=5029; mbox=session#88740653f92848b3a18f0e4253c5e0df#1664971878|PC#88740653f92848b3a18f0e4253c5e0df.38_0#1680522018; s_tslv=1664970055947; AnalyticsSyncHistory=AQJ7EsFRdIK6EgAAAYQFOhPGy03MbN3zkS5nYUdDOwsFqnA3LxmxF5d7JV1A6Cz_35BvalYG-YP1h4k7KD3apg; lms_ads=AQFJO3XuguHbtwAAAYQFOhVrQhYMBBXuvhoJT6tEQThH9kB7T-wacnoa70WqMTROveT36m0wAv_EHcnf9XlG-03Vub8XAVkQ; lms_analytics=AQFJO3XuguHbtwAAAYQFOhVrQhYMBBXuvhoJT6tEQThH9kB7T-wacnoa70WqMTROveT36m0wAv_EHcnf9XlG-03Vub8XAVkQ; lang=v=2&lang=en-us; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASzPHfwBu97LAAABfna4lp8AAAGENqKjOE0AEXTFL8COWZr2zdbVCXLKeH5xA8hKoDXOeOf4k2wHMHOIS0seQEl_qlKEv2uqBV4Zgx4MiTMAioM7hUG00p7UMdrdiLvIJGew7wkO57I24-X2T_vj; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19291%7CMCMID%7C58931934225235618515480127113825235795%7CMCOPTOUT-1666778640s%7CNONE%7CvVersion%7C5.1.1; UserMatchHistory=AQLsRKDfwiKddgAAAYQTU57jUnrrZDpbHeSDLuIhYc_i0WDJAhKG6tigByIhDAU0IXiTZLLQGUyqE0bAdr3vLDj1FDreP1GEgwh-BMQob-ooIOO0VQ6aH9Fyz0FTNUFcx7jXLD87vO9_gszKqTFFr54KZDSvD70JRW0ttQLqbNetCG8-JnCEGi213efyovUK2bt8Eaz8qB8aNn75gGLanoPaysYu7PKhpvSP4MIT9UBEVtak6SqqtdAAH6Ukxw4c46Qfm8cxKU2juU-Xa1RXWap8ECpYNC_zA-dm2YA; lidc=\"b=OB32:s=O:r=O:a=O:p=O:g=3643:u=350:x=1:i=1666771563:t=1666810950:v=2:sig=AQFQurTSU8QHGogKBlmXoVr_GWn1yFeI\"`,
          "Referer": "https://www.linkedin.com/in/nhin-l%C3%AA-ch%C3%AD-0333a3134/details/skills/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

    const skill = (await re.json()).included
          .filter(item => item.components?.elements?.length)
          .map(item => item.components.elements.map(item2 => item2.components.entityComponent.title.text))
    const skill2 = [...new Set((skill || []).flat())];
    return skill2
  }

  async function getExperience(id){
    const cookie = document.cookie.split(";").reduce((res, c) => {
      const [key, val] = c.trim().split("=").map(decodeURIComponent);
      const allNumbers = (str) => /^\d+$/.test(str);
      try {
      return Object.assign(res, {
          [key]: allNumbers(val) ? val : JSON.parse(val),
      });
      } catch (e) {
      return Object.assign(res, { [key]: val });
      }
  }, {});
    const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?variables=(profileUrn:urn%3Ali%3Afsd_profile%3A${id})&&queryId=voyagerIdentityDashProfileCards.cbd8be1925047f7455c602a64807bb1a`, {
      "headers": {
        "accept": "application/vnd.linkedin.normalized+json+2.1",
        "accept-language": "en-US,en;q=0.9",
        "csrf-token": "ajax:7697808159906382804",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-li-lang": "en_US",
        "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base;JCc3mLnpRFeu05N7rSGrIQ==",
        "x-li-pem-metadata": "Voyager - Profile=profile-tab-initial-cards",
        "x-li-track": "{\"clientVersion\":\"1.11.2875\",\"mpVersion\":\"1.11.2875\",\"osName\":\"web\",\"timezoneOffset\":7,\"timezone\":\"Asia/Saigon\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":1,\"displayWidth\":1920,\"displayHeight\":1200}",
        "x-restli-protocol-version": "2.0.0",
        "cookie": `G_ENABLED_IDPS=google; liap=true; JSESSIONID=\"${cookie.JSESSIONID}\"; li_sugr=c590a8a5-5bcb-4427-995e-95d04c6eefa6; li_theme=light; li_theme_set=app; _gcl_au=1.1.1331885719.1648981767; timezone=Asia/Saigon; li_rm=AQFOSgXfEcZzjQAAAYH5UP010hI4zorQfsfJ4JneovX5rEr5Id2X3ylWI_W9urzi0thEWLfOpwy128A-w0lfqi0xsNt4DOacSI_rG6lZiscptKz9ibmkhD9U; bcookie=\"v=2&54ded92b-5bd9-45ab-848f-f5b314814215\"; bscookie=\"v=1&20220721172028fb993bd5-f5a8-4b17-8271-1abe706c5d2eAQEho4Xcs34ZpyWcHQPY1wguzSMa7Im1\"; _guid=bfbeedf5-334d-4847-96cb-1a373e54433f; s_fid=6432FE948834E872-1F739E5D40B3B71F; gpv_pn=developer.linkedin.com%2Fproduct-catalog; s_ips=948; s_tp=5029; mbox=session#88740653f92848b3a18f0e4253c5e0df#1664971878|PC#88740653f92848b3a18f0e4253c5e0df.38_0#1680522018; s_tslv=1664970055947; li_at=AQEDASzPHfwBu97LAAABfna4lp8AAAGEEpm8aE0AwrwRoZDvY8xoMPfkx8E3H5sDUAGolphK0Kh3m2O3yuZSCwDsMZ7h_D0avTTdehNTTBMqA8KJFaouudU8qWTWlXpnYJJhFXjRuvY9QX8EnHl41gb8; AnalyticsSyncHistory=AQJ7EsFRdIK6EgAAAYQFOhPGy03MbN3zkS5nYUdDOwsFqnA3LxmxF5d7JV1A6Cz_35BvalYG-YP1h4k7KD3apg; lms_ads=AQFJO3XuguHbtwAAAYQFOhVrQhYMBBXuvhoJT6tEQThH9kB7T-wacnoa70WqMTROveT36m0wAv_EHcnf9XlG-03Vub8XAVkQ; lms_analytics=AQFJO3XuguHbtwAAAYQFOhVrQhYMBBXuvhoJT6tEQThH9kB7T-wacnoa70WqMTROveT36m0wAv_EHcnf9XlG-03Vub8XAVkQ; lang=v=2&lang=en-us; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; UserMatchHistory=AQKQln0z2mCNHwAAAYQSg_AHbrusjlgIkHOime7bFOwgKJkV2GI8jm81W4c85oBVn_bax63LjrETTNHzKnD6WFODOcrRuE5FOhiL9ZlhH0GZfqhjBGxrAPVjjpWhCKp88JHwM3A-TAPMoFj62UXNAnrHAL1mgBycDppdFoQmy8ojZ99CqNmpagsWE72pyqsHAwL2THQ0ORNPjrbOiOqRIspZAxWictsUwk7ZsaIfZND-4c-CSf7Qb3Al8Zi072uohOsSV1hhZ4lOZHSD2Iv6pG-xq2St22nloUAjWkA; lidc=\"b=OB32:s=O:r=O:a=O:p=O:g=3643:u=350:x=1:i=1666757949:t=1666810950:v=2:sig=AQEjXf87SzRUQpFLgS27K8n71OD3Rko0\"; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19291%7CMCMID%7C58931934225235618515480127113825235795%7CMCOPTOUT-1666765359s%7CNONE%7CvVersion%7C5.1.1`,
        "Referer": "https://www.linkedin.com/search/results/people/?keywords=mobile%20engineer&origin=SWITCH_SEARCH_VERTICAL&sid=i%3Bg",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });

    const data = await res.json();

    return scriptFormat(data)
  }

  const crawrlInfo = async () => {

  let temp = []
  document
      .querySelectorAll(
      ".reusable-search__entity-result-list > .reusable-search__result-container"
      )
      .forEach((element, index) => {
          if(element.querySelector(".artdeco-button__text").innerText !== "Connect") return;
          const p = getInfoPeople(element, index)
          if(p) {

            temp.push(p)
            // postNoti(p)
            // element.querySelector(".artdeco-button__text").innerText = "Pending"
            // element.querySelector(".artdeco-button").className = element.querySelector(".artdeco-button").className.replace('artdeco-button--2', 'artdeco-button--muted')
          }
      });

      const sk = await Promise.all(temp.map(({profile}) => getSkill(profile)))
      const ex = await Promise.all(temp.map(({profile}) => getExperience(profile)))

      const newA = temp.map((item, index) => ({...item, skill: (sk[index] || []).join( ' - '), certificate: ex[index].certificate2, companies: ex[index].companies2, eucation: ex[index].eucation2}))

      let localstore = JSON.parse(localStorage.getItem('AddInjectLinkedin') || '[]')

      localStorage.setItem('AddInjectLinkedin', JSON.stringify([...localstore,...newA]))
      temp = []
      alert('Xong')
  };

  window.crawrlInfo = crawrlInfo

  console.log('Inprogress Okie lắm Quyê')
}

function initExport() {
  const exportMM = () => {

    let localstore = JSON.parse(localStorage.getItem('AddInjectLinkedin') || '[]')
    const rows = [
        // ["lastName", "userLink", "headline", "address","description", "pictures", "memberId", "entityUrn"],
        ["lastName", "firsName", "email", "phone","userLink", "company", "currenttitle", "level", 'skill', "headline", "address","description", 'certificate', 'companies', 'eucation', "memberId", "entityUrn", "pictures"],
    ];


    const format = (strs) => {
      return strs.map(str => (str || '').replace(/,/g, '-'))
    }

    const formatLevel =(str) => {
      if((str || '').toLowerCase().included("lead") || (str || '').toLowerCase().included("leader")) return "Lead";
      if((str || '').toLowerCase().included("manager") || (str || '').toLowerCase().included("management")) return "Manager";

      if((str || '').toLowerCase().included("director")) return "Director";

      if((str || '').toLowerCase().included("head")) return "Head";

      if((str || '').toLowerCase().included("associate")) return "Associate";

      if((str || '').toLowerCase().included("fresher")) return "Fresher";

      if((str || '').toLowerCase().included("junior")) return "Junior";

      if((str || '').toLowerCase().included("senior")) return "Senior";

      if((str || '').toLowerCase().included("developer")) return "Developer";

      if((str || '').toLowerCase().included("engineer")) return "Engineer";

      return 'Software'
    }

    const formatCompany =(str = '') => {
      str = str.replace('Full-time', '')
      str = str.replace('Part-time', '')
      return str.trim()
    }

    localstore.map(c => {
      if(!c) return;
      rows.push(format([
        c.lastName || '',
        c.firstName || '' ,
        c.email || '' ,
        c.phone || '' ,
        c.userLink || '' ,
        formatCompany(c.companies[0].sub || c.companies[0].text || ''),
        c.companies[0].title || c.companies[0].text || '' ,
        formatLevel(c.companies[0].title || c.companies[0].text || ''),
        c.skill || '' ,
        c.headline || '' ,
        c.address || '',
        c.description || '',
        c?.certificate?.map(c => c.text)?.toString() || '',
        c.companies?.map(c => c.text).toString() || '',
        c.eucation?.map(c => c.text)?.toString() || '',
        c.memberId || '',
        c.entityUrn || '',
        c.pictures || ''
      ]))
    })

    console.log('rows', rows)

    let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);

    console.log('encodedUri', encodedUri)

    // localStorage.removeItem('AddInjectLinkedin' )
    window.open(encodedUri);
  }

  window.exportMM = exportMM

}

console.log('Initial.....')
initAdd()
initExport()

document.getElementById('add').addEventListener('click', ()=> {
  chrome.tabs.executeScript({
    code: `window.crawrlInfo()`
  });
})

document.getElementById('export').addEventListener('click', ()=> {
  chrome.tabs.executeScript({
    code: `window.exportMM()`
  });
})
