
export function initExport() {

  let localstore = localStorage.getItem('AddInjectLinkedin') || []

  const exportMM = () => {
    const rows = [
        ["fullName", "userLink", "headline", "address","description", "pictures", "memberId", "entityUrn"],
    ];

    localstore.map(c => {
      rows.push([c.fullName, c.userLink ,c.headline ,c.address ,c.description ,c.pictures ,c.memberId ,c.entityUrn ])
    })

    let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);

    console.log('encodedUri', encodedUri)
    window.open(encodedUri);
  }

  window.exportMM = exportMM

}



export default initExport
