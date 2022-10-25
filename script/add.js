function initAdd() {
    const formatUrn = (urn) => `urn:li:fsd_profile:${urn}`;

    const getEntityUrn = (urlA) => {
    const url = new URL(urlA);

    if (!url.search) {
        return formatUrn(url.pathname.replace("/in/", ""));
    }

    const param = url.searchParams.get("facetConnectionOf");
    const ids = param.match(/\"(.*)\"/);
    return formatUrn(ids[1]);
    };

    function getInfoPeople(element) {
    return {
        fullName: element.querySelector(
        "span.entity-result__title-text .app-aware-link > span > span"
        ).innerText,
        userLink: element
        .querySelector("span.entity-result__title-text .app-aware-link")
        .getAttribute("href"),
        entityUrn: getEntityUrn(
        element.querySelector(
            ".app-aware-link.entity-result__simple-insight-wrapping-link"
        )?.href ||
            element.querySelectorAll(
            ".entity-result__simple-insight-text-container a.app-aware-link"
            )?.[2]?.href
        ),
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
    }

    function postNoti({ fullName, entityUrn }) {
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

    let localstore = localStorage.getItem('AddInjectLinkedin') || []

    const crawrlInfo = () => {
    document
        .querySelectorAll(
        ".reusable-search__entity-result-list > .reusable-search__result-container"
        )
        .forEach((element) => {
            if(element.querySelector(".artdeco-button__text").innerText !== "Connect") return;
            const p = getInfoPeople(element)
            localstore.push(p)
            postNoti(p)
            element.querySelector(".artdeco-button__text").innerText = "Pending"
            element.querySelector(".artdeco-button").className = element.querySelector(".artdeco-button").className.replace('artdeco-button--2', 'artdeco-button--muted')
        });

        localStorage.setItem('AddInjectLinkedin', JSON.stringify(localstore))
        console.log('okie add xong Quyê')
    };


    window.crawrlInfo = crawrlInfo

    console.log('Inprogress Okie lắm Quyê')
}

export default initAdd
