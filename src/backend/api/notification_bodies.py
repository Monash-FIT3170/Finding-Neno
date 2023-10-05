


def generate_email_body_sighting(owner, pet, sighter, sighting_data):
    """
    Generates and returns the body of the email to be sent to the owner of a missing pet when a pet is potentially sighted.

    Args:
        owner: the owner of the missing pet 
        pet: the missing pet
        sighter: the person who sighted the pet
        sighting_data: the data of the sighting
    """
    location_longitude, location_latitude = sighting_data['lastLocation'].split(",")
    html_code = f""" <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
            a {{text-decoration: none;}}
        </style>
        <![endif]--><!--[if gte mso 9]>
        <style>sup {{ font-size: 100% !important; }}</style>
        <![endif]--><!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {{
            max-height:0px!important;
            display:none!important;
            }}
            .rollover:hover .rollover-second {{
            max-height:none!important;
            display:inline-block!important;
            }}
            .rollover div {{
            font-size:0px;
            }}
            u ~ div img + div > div {{
            display:none;
            }}
            #outlook a {{
            padding:0;
            }}
            span.MsoHyperlink,
            span.MsoHyperlinkFollowed {{
            color:inherit;
            mso-style-priority:99;
            }}
            a.es-button {{
            mso-style-priority:100!important;
            text-decoration:none!important;
            }}
            a[x-apple-data-detectors] {{
            color:inherit!important;
            text-decoration:none!important;
            font-size:inherit!important;
            font-family:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
            }}
            .es-desk-hidden {{
            display:none;
            float:left;
            overflow:hidden;
            width:0;
            max-height:0;
            line-height:0;
            mso-hide:all;
            }}
            .es-button-border:hover > a.es-button {{
            color:#ffffff!important;
            }}
            @media only screen and (max-width:600px) {{*[class="gmail-fix"] {{ display:none!important }} p, a {{ line-height:150%!important }} h1, h1 a {{ line-height:120%!important }} h2, h2 a {{ line-height:120%!important }} h3, h3 a {{ line-height:120%!important }} h4, h4 a {{ line-height:120%!important }} h5, h5 a {{ line-height:120%!important }} h6, h6 a {{ line-height:120%!important }} h1 {{ font-size:30px!important; text-align:left }} h2 {{ font-size:24px!important; text-align:left }} h3 {{ font-size:20px!important; text-align:left }} h4 {{ font-size:24px!important; text-align:left }} h5 {{ font-size:20px!important; text-align:left }} h6 {{ font-size:16px!important; text-align:left }} .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {{ font-size:30px!important }} .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {{ font-size:24px!important }} .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {{ font-size:20px!important }} .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a {{ font-size:24px!important }} .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a {{ font-size:20px!important }} .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a {{ font-size:16px!important }} .es-menu td a {{ font-size:14px!important }} .es-header-body p, .es-header-body a {{ font-size:14px!important }} .es-content-body p, .es-content-body a {{ font-size:14px!important }} .es-footer-body p, .es-footer-body a {{ font-size:14px!important }} .es-infoblock p, .es-infoblock a {{ font-size:12px!important }} .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 {{ text-align:center!important }} .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 {{ text-align:right!important }} .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 {{ text-align:justify!important }} .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 {{ text-align:left!important }} .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img {{ display:inline!important }} .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second {{ display:inline!important }} .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div {{ line-height:0!important; font-size:0!important }} .es-spacer {{ display:inline-table }} a.es-button, button.es-button {{ font-size:18px!important }} a.es-button, button.es-button {{ display:inline-block!important }} .es-button-border {{ display:inline-block!important }} .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button {{ display:block!important }} .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu {{ display:inline-block!important }} .es-adaptive table, .es-left, .es-right {{ width:100%!important }} .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header {{ width:100%!important; max-width:600px!important }} .adapt-img {{ width:100%!important; height:auto!important }} .es-mobile-hidden, .es-hidden {{ display:none!important }} .es-desk-hidden {{ width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important }} tr.es-desk-hidden {{ display:table-row!important }} table.es-desk-hidden {{ display:table!important }} td.es-desk-menu-hidden {{ display:table-cell!important }} .es-menu td {{ width:1%!important }} table.es-table-not-adapt, .esd-block-html table {{ width:auto!important }} .es-social td {{ padding-bottom:10px }} .h-auto {{ height:auto!important }} }}
        </style>
    </head>
    <body style="width:100%;height:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#F6F6F6">
            <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f6f6f6"></v:fill>
            </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                <tr>
                <td valign="top" style="padding:0;Margin:0">
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" bgcolor="transparent" style="padding:0;Margin:0">
                            <table class="es-content-body" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://sgcmot.stripocdn.email/content/guids/CABINET_d15f1af50b484478c138f46c75b97b7c0f5a9326a32d75113493ae7ac3996480/images/g206d4c2bd96809dbd75f777c18d9e95703ee4887f0f01fd50224c3fc4e3f5a33f1298c10be79fc13eeb3362861c2447d_640_mZI.jpeg" alt="" width="560" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="left" style="padding:0;Margin:0">
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Dear {owner['name']},&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We hope this message finds you well. We understand the emotional toll of losing a beloved pet, and we're committed to helping you reunite with your furry friend. We have some promising news to share with you today.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">It appears that someone in our community may have spotted a pet that matches the description of your beloved companion! We want to keep you informed and provide you with all the details. Here's the information we have received:&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Potential Sighting Details:</strong></p>
                                                        <ul style="list-style-type:circle">
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Date and Time: {sighting_data['dateTime']}</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Location:<a href="https://maps.google.com/?q={location_latitude},{location_longitude}">{location_latitude + ', ' + location_longitude}</a></p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Description: {sighting_data['description']}&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Picture: See the following <a href="{sighting_data['imageUrl']}">link</a>&nbsp;for picture.</p>
                                                            </li>
                                                        </ul>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">This sighting has been posted by a fellow member of our community who cares about reuniting lost pets with their loving owners. While we cannot guarantee that this is indeed your pet, we encourage you to take immediate action.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Here's what you can do:&nbsp;&nbsp;</strong></p>
                                                        <ol>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"> <strong>Contact the Poster:</strong>&nbsp; Send a private message to the member who reported the sighting. They may have more information to share or could assist you further. Their contact details are: 
                                                                    <ul style="list-style-type:circle">
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Name: {sighter['name']} </p>
                                                                        </li>
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Email address: <a href="mailto:{sighter['email_address']}">{sighter['email_address']}</a></p>
                                                                        </li>
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Phone number: <a href="tel:{sighter['phone_number']}">{sighter['phone_number']}</a>.</p>
                                                                        </li>
                                                                    </ul>
                                                                  <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Please be in touch with them as soon as possible to see if they can help.&nbsp;&nbsp; </p>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Visit the Location:</strong>&nbsp;If the sighting location is nearby, consider visiting it as soon as possible. Bring a recent photo of your pet and any identification or documentation you have.&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Alert Local Authorities:</strong>&nbsp;If the sighting is in a public area, you may want to notify your local animal control or shelter. They can help you navigate the situation and provide guidance.&nbsp;&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Stay Hopeful:</strong>&nbsp;While this is an encouraging lead, remember that not all sightings result in a reunion. However, maintaining hope and staying proactive greatly increase the chances of bringing your pet back home.&nbsp;&nbsp;</p>
                                                            </li>
                                                        </ol>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We understand that this can be a stressful time, but we are here to support you every step of the way. Feel free to reach out to us if you need any assistance or have questions.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We sincerely hope that this sighting leads to a joyful reunion between you and your furry companion. Our community is here to rally behind you, offering support and encouragement throughout this journey.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Remember, there are many success stories of lost pets being found, and we're committed to making yours one of them.&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Wishing you the best of luck in the search for your beloved pet!&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Warm regards,&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">The Finding Neno Team</p>
                                                    </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-left:20px;padding-bottom:20px">
                                        <!--[if mso]>
                                        <table style="width:560px" cellpadding="0"
                                        cellspacing="0">
                                        <tr>
                                            <td style="width:270px" valign="top">
                                                <![endif]-->
                                                <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                    <tr>
                                                    <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://sgcmot.stripocdn.email/content/guids/CABINET_d15f1af50b484478c138f46c75b97b7c0f5a9326a32d75113493ae7ac3996480/images/logo_1.png" alt="" width="270" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                            </td>
                                            <td style="width:20px"></td>
                                            <td style="width:270px" valign="top">
                                                <![endif]-->
                                                <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                                    <tr>
                                                    <td align="left" style="padding:0;Margin:0;width:270px">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td style="padding:0;Margin:0;display:none" align="center"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                            </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    """
    return html_code


def generate_email_missing_report(pet, report_data):
    """
    Generates and returns the body of the email to be sent to a user who has opted into notification when a pet is reported missing
    in his/her area.

    Args:
        pet: the missing pet data
        report_data: the data of the report
    """
    html_code = f"""
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
            a {{text-decoration: none;}}
        </style>
        <![endif]--><!--[if gte mso 9]>
        <style>sup {{ font-size: 100% !important; }}</style>
        <![endif]--><!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {{
            max-height:0px!important;
            display:none!important;
            }}
            .rollover:hover .rollover-second {{
            max-height:none!important;
            display:inline-block!important;
            }}
            .rollover div {{
            font-size:0px;
            }}
            u ~ div img + div > div {{
            display:none;
            }}
            #outlook a {{
            padding:0;
            }}
            span.MsoHyperlink,
            span.MsoHyperlinkFollowed {{
            color:inherit;
            mso-style-priority:99;
            }}
            a.es-button {{
            mso-style-priority:100!important;
            text-decoration:none!important;
            }}
            a[x-apple-data-detectors] {{
            color:inherit!important;
            text-decoration:none!important;
            font-size:inherit!important;
            font-family:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
            }}
            .es-desk-hidden {{
            display:none;
            float:left;
            overflow:hidden;
            width:0;
            max-height:0;
            line-height:0;
            mso-hide:all;
            }}
            .es-button-border:hover > a.es-button {{
            color:#ffffff!important;
            }}
            @media only screen and (max-width:600px) {{*[class="gmail-fix"] {{ display:none!important }} p, a {{ line-height:150%!important }} h1, h1 a {{ line-height:120%!important }} h2, h2 a {{ line-height:120%!important }} h3, h3 a {{ line-height:120%!important }} h4, h4 a {{ line-height:120%!important }} h5, h5 a {{ line-height:120%!important }} h6, h6 a {{ line-height:120%!important }} h1 {{ font-size:30px!important; text-align:left }} h2 {{ font-size:24px!important; text-align:left }} h3 {{ font-size:20px!important; text-align:left }} h4 {{ font-size:24px!important; text-align:left }} h5 {{ font-size:20px!important; text-align:left }} h6 {{ font-size:16px!important; text-align:left }} .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {{ font-size:30px!important }} .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {{ font-size:24px!important }} .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {{ font-size:20px!important }} .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a {{ font-size:24px!important }} .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a {{ font-size:20px!important }} .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a {{ font-size:16px!important }} .es-menu td a {{ font-size:14px!important }} .es-header-body p, .es-header-body a {{ font-size:14px!important }} .es-content-body p, .es-content-body a {{ font-size:14px!important }} .es-footer-body p, .es-footer-body a {{ font-size:14px!important }} .es-infoblock p, .es-infoblock a {{ font-size:12px!important }} .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 {{ text-align:center!important }} .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 {{ text-align:right!important }} .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 {{ text-align:justify!important }} .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 {{ text-align:left!important }} .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img {{ display:inline!important }} .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second {{ display:inline!important }} .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div {{ line-height:0!important; font-size:0!important }} .es-spacer {{ display:inline-table }} a.es-button, button.es-button {{ font-size:18px!important }} a.es-button, button.es-button {{ display:inline-block!important }} .es-button-border {{ display:inline-block!important }} .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button {{ display:block!important }} .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu {{ display:inline-block!important }} .es-adaptive table, .es-left, .es-right {{ width:100%!important }} .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header {{ width:100%!important; max-width:600px!important }} .adapt-img {{ width:100%!important; height:auto!important }} .es-mobile-hidden, .es-hidden {{ display:none!important }} .es-desk-hidden {{ width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important }} tr.es-desk-hidden {{ display:table-row!important }} table.es-desk-hidden {{ display:table!important }} td.es-desk-menu-hidden {{ display:table-cell!important }} .es-menu td {{ width:1%!important }} table.es-table-not-adapt, .esd-block-html table {{ width:auto!important }} .es-social td {{ padding-bottom:10px }} .h-auto {{ height:auto!important }} }}
        </style>
    </head>
    <body style="width:100%;height:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#F6F6F6">
            <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f6f6f6"></v:fill>
            </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                <tr>
                <td valign="top" style="padding:0;Margin:0">
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://smmxjr.stripocdn.email/content/guids/CABINET_68d0f7bde04ad336b178aed05d00fcee8584f0b273da520b0c314120481881b7/images/gf1aa18e3ee285227039d5dbce6317a2395decc7e7fa34c84856f0e5e9ce49b51de2b990922a55a340d57d0f27ae050ad_640.jpeg" alt="" width="560" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="center" style="padding:20px;Margin:0;font-size:0">
                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="es-spacer" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                    <tr>
                                                    <td align="left" style="padding:0;Margin:0">
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Dear ,</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We hope this message finds you well. At Finding Neno, we are committed to creating a strong and caring community that looks out for our furry friends. Today, we have an important update for you.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">You've chosen to opt into notifications for missing pets in your area, and we deeply appreciate your compassion for the pets and their owners in your community. Your willingness to help can make a significant difference in reuniting lost pets with their loving families.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We want to inform you that a pet has been reported missing in your vicinity. While you may not be the pet owner yourself, your involvement can be instrumental in assisting a distressed pet owner who is desperately searching for their beloved companion.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Missing Pet Details:</strong></p>
                                                        <ul style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin:15px 0px">
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Type:</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Breed:</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Name:</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Description:</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Image:</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Last seen on:&nbsp;</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Last seen at:</p>
                                                            </li>
                                                        </ul>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Your willingness to be a part of this initiative and receive notifications is a testament to your kind-heartedness. Here's how you can contribute to this effort:</p>
                                                        <ol style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin:15px 0px">
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Spread the Word:</strong>&nbsp;Share this notification with your friends and neighbors in the area. The more people who are aware, the higher the chances of the pet being found.</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Keep an Eye Out:</strong>&nbsp;As you go about your day, please be vigilant and watchful for any signs of the missing pet. Sometimes, a simple sighting can lead to a joyful reunion.</p>
                                                            </li>
                                                            <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Report Any Leads:</strong>&nbsp;If you notice anything unusual or have information that might help locate the pet, please report it to us via the app. We can then pass this information along to the pet owner or local authorities.</p>
                                                            </li>
                                                        </ol>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Your involvement in our community-driven effort to reunite lost pets with their families is truly commendable. We believe that together, we can make a positive impact and bring comfort to those in need.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Thank you for being a caring member of our community. Your compassion does not go unnoticed, and your actions have the power to bring happiness and relief to both pets and their owners.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Should you have any questions or require further information, please don't hesitate to reach out to us. We're here to support you in any way we can.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Together, we can make a difference.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Warm Regards</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">The Finding Neno Team</p>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" bgcolor="transparent" style="padding:0;Margin:0">
                            <table class="es-content-body" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://smmxjr.stripocdn.email/content/guids/CABINET_68d0f7bde04ad336b178aed05d00fcee8584f0b273da520b0c314120481881b7/images/logo_1.png" alt="" width="275" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    """

    def generate_email_potential_sighting(sighting_data, sighter, owner):
        """
        Generates an email to send to pet owners when a sighting is reported that meets criteria of the owners missing pet and location
        
        Args:
            sighting_data: Data containing the sighting information
            sighter: Data containing the sighter information
            owner: Data containing the owner information
        """
        

        html_code = f"""
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>New message</title>
            <!--[if (mso 16)]>
            <style type="text/css">
                a {{text-decoration: none;}}
            </style>
            <![endif]--><!--[if gte mso 9]>
            <style>sup {{ font-size: 100% !important; }}</style>
            <![endif]--><!--[if gte mso 9]>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <style type="text/css">
                .rollover:hover .rollover-first {{
                max-height:0px!important;
                display:none!important;
                }}
                .rollover:hover .rollover-second {{
                max-height:none!important;
                display:inline-block!important;
                }}
                .rollover div {{
                font-size:0px;
                }}
                u ~ div img + div > div {{
                display:none;
                }}
                #outlook a {{
                padding:0;
                }}
                span.MsoHyperlink,
                span.MsoHyperlinkFollowed {{
                color:inherit;
                mso-style-priority:99;
                }}
                a.es-button {{
                mso-style-priority:100!important;
                text-decoration:none!important;
                }}
                a[x-apple-data-detectors] {{
                color:inherit!important;
                text-decoration:none!important;
                font-size:inherit!important;
                font-family:inherit!important;
                font-weight:inherit!important;
                line-height:inherit!important;
                }}
                .es-desk-hidden {{
                display:none;
                float:left;
                overflow:hidden;
                width:0;
                max-height:0;
                line-height:0;
                mso-hide:all;
                }}
                .es-button-border:hover > a.es-button {{
                color:#ffffff!important;
                }}
                @media only screen and (max-width:600px) {{*[class="gmail-fix"] {{ display:none!important }} p, a {{ line-height:150%!important }} h1, h1 a {{ line-height:120%!important }} h2, h2 a {{ line-height:120%!important }} h3, h3 a {{ line-height:120%!important }} h4, h4 a {{ line-height:120%!important }} h5, h5 a {{ line-height:120%!important }} h6, h6 a {{ line-height:120%!important }} h1 {{ font-size:30px!important; text-align:left }} h2 {{ font-size:24px!important; text-align:left }} h3 {{ font-size:20px!important; text-align:left }} h4 {{ font-size:24px!important; text-align:left }} h5 {{ font-size:20px!important; text-align:left }} h6 {{ font-size:16px!important; text-align:left }} .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {{ font-size:30px!important }} .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {{ font-size:24px!important }} .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {{ font-size:20px!important }} .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a {{ font-size:24px!important }} .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a {{ font-size:20px!important }} .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a {{ font-size:16px!important }} .es-menu td a {{ font-size:14px!important }} .es-header-body p, .es-header-body a {{ font-size:14px!important }} .es-content-body p, .es-content-body a {{ font-size:14px!important }} .es-footer-body p, .es-footer-body a {{ font-size:14px!important }} .es-infoblock p, .es-infoblock a {{ font-size:12px!important }} .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 {{ text-align:center!important }} .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 {{ text-align:right!important }} .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 {{ text-align:justify!important }} .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 {{ text-align:left!important }} .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img {{ display:inline!important }} .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second {{ display:inline!important }} .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div {{ line-height:0!important; font-size:0!important }} .es-spacer {{ display:inline-table }} a.es-button, button.es-button {{ font-size:18px!important }} a.es-button, button.es-button {{ display:inline-block!important }} .es-button-border {{ display:inline-block!important }} .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button {{ display:block!important }} .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu {{ display:inline-block!important }} .es-adaptive table, .es-left, .es-right {{ width:100%!important }} .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header {{ width:100%!important; max-width:600px!important }} .adapt-img {{ width:100%!important; height:auto!important }} .es-mobile-hidden, .es-hidden {{ display:none!important }} .es-desk-hidden {{ width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important }} tr.es-desk-hidden {{ display:table-row!important }} table.es-desk-hidden {{ display:table!important }} td.es-desk-menu-hidden {{ display:table-cell!important }} .es-menu td {{ width:1%!important }} table.es-table-not-adapt, .esd-block-html table {{ width:auto!important }} .es-social td {{ padding-bottom:10px }} .h-auto {{ height:auto!important }} }}
            </style>
        </head>
        <body style="width:100%;height:100%;padding:0;Margin:0">
            <div class="es-wrapper-color" style="background-color:#F6F6F6">
                <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                    <tr>
                    <td valign="top" style="padding:0;Margin:0">
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                        <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://smmxjr.stripocdn.email/content/guids/CABINET_68d0f7bde04ad336b178aed05d00fcee8584f0b273da520b0c314120481881b7/images/gf1aa18e3ee285227039d5dbce6317a2395decc7e7fa34c84856f0e5e9ce49b51de2b990922a55a340d57d0f27ae050ad_640.jpeg" alt="" width="560" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                        <td align="center" style="padding:0;Margin:0;font-size:0" height="40"></td>
                                                        </tr>
                                                        <tr>
                                                        <td align="left" style="padding:0;Margin:0">
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Dear ,</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We hope this message finds you well during your search for your beloved pet. At Finding Neno, our mission is to reunite lost pets with their loving owners, and today, we have important information to share with you.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We understand the rollercoaster of emotions that come with the uncertainty of searching for a lost pet, and we're committed to keeping you informed every step of the way.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We want to inform you that a fellow user of our community has reported a sighting of a pet. This notification has been sent to you because you meet specific criteria for receiving notifications related to this sighting. While we cannot guarantee that this is your pet, we want to ensure you have all the information you need to investigate further.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Potential Sighting Details:</strong></p>
                                                            <ul style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin:15px 0px">
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Pet Type:</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Breed:</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Description:</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Image:</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Date and Time</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Location</p>
                                                                </li>
                                                            </ul>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We Encourage you to take the following steps:</p>
                                                            <ol style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin:15px 0px">
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Contact the Poster:</strong>&nbsp;Reach out to the user who reported the sighting. They may have additional information or could help you confirm whether it's your pet.</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Review the Details:</strong>&nbsp;Carefully examine the information provided in the sighting notification. Compare it with the details of your missing pet to see if there's a potential match.</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Visit the Location:</strong>&nbsp;If the sighting location is within reach, consider visiting it as soon as possible with a recent photo of your pet and any identification or documentation you have.</p>
                                                                </li>
                                                                <li style="color:#333333;margin:0px 0px 15px;font-size:14px">
                                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Alert Local Authorities:</strong>&nbsp;If the sighting is in a public area, it may be wise to notify your local animal control or shelter. They can provide guidance and support.</p>
                                                                </li>
                                                            </ol>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We understand that this can be a time of both hope and apprehension. While not every sighting leads to a reunion, your swift response and active involvement can significantly increase the chances of finding your furry companion.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Remember, our community is here to support you throughout this journey.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We sincerely hope that this sighting notification brings you one step closer to reuniting with your cherished pet. Your determination and love for your furry friend inspire us all.</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Wishing you the best of luck in your search!</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Warm Regards</p>
                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">The Finding Neno Team</p>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                        </table>
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td align="center" bgcolor="transparent" style="padding:0;Margin:0">
                                <table class="es-content-body" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                            <table cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="left" style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                        <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://smmxjr.stripocdn.email/content/guids/CABINET_68d0f7bde04ad336b178aed05d00fcee8584f0b273da520b0c314120481881b7/images/logo_1.png" alt="" width="275" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
        """