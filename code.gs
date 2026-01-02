function doPost(e) {
  try {
    const SHEET_ID = '1wPJvIc-lZbBKKiaDZww-7vpjHIwt53WLwjcq5IXIcjQ';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Get raw POST data (fixes JSON parsing)
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.orderId || 'NO-ID',
      data.timestamp || 'NO-TIME',
      data.email,
      data.phone,  
      data.productRating || 0,
      data.deliveryRating || 0,
      data.source || 'unknown',
      data.comments || 'No comments'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'SUCCESS'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'ERROR', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
