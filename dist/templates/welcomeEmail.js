"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmailHtml = exports.getWelcomeEmailSubject = void 0;
const getWelcomeEmailSubject = (name) => {
    const firstName = name?.trim() ? name.trim().split(' ')[0] : '';
    return firstName
        ? `Welcome to the family, ${firstName}! 🪰 — Ifi from Haifly Trap`
        : `Welcome to the family! 🪰 — Ifi from Haifly Trap`;
};
exports.getWelcomeEmailSubject = getWelcomeEmailSubject;
const getWelcomeEmailHtml = (data) => {
    const fullName = data.name?.trim() || '';
    const firstName = fullName ? fullName.split(' ')[0] : 'there';
    const shopUrl = 'https://www.haiflytrapng.com/shop';
    const reviewsUrl = 'https://www.haiflytrapng.com/reviews';
    const trackUrl = 'https://www.haiflytrapng.com/track';
    const whatsappUrl = 'https://wa.me/2348031301311?text=' +
        encodeURIComponent('Hi Ifi, I just joined Haifly Trap and want to set up my No Fly Zone!');
    // Production image assets hosted on haiflytrapng.com
    const heroImg = 'https://www.haiflytrapng.com/images/lanscape-1.png';
    const trapImg = 'https://www.haiflytrapng.com/images/TRAPIMG1.png';
    const sprayImg = 'https://www.haiflytrapng.com/images/Broadkillersurefacespray.png';
    const safeImg = 'https://www.haiflytrapng.com/images/SAFERPOST.png';
    const riderImg = 'https://www.haiflytrapng.com/images/delivery_rider.png';
    // Design System Palette
    const forestGreen = '#0f5238';
    const freshGreen = '#006c48';
    const gold = '#d4a017';
    const goldLight = '#e5b52e';
    const onSurface = '#191c1c';
    const mainSurface = '#f8faf9';
    const surfaceLow = '#f0f4f2';
    const footerBg = '#1a5c38';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Haifly Trap</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0b110e; font-family: 'Work Sans', Arial, sans-serif; color: ${onSurface}; }
    @media only screen and (max-width: 600px) {
      .container-table { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-title { font-size: 26px !important; line-height: 32px !important; }
      .prod-title { font-size: 24px !important; line-height: 28px !important; }
      .footer-grid-col { display: block !important; width: 100% !important; margin-bottom: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0 48px; background-color: #0b110e;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b110e;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Container (600px Max, Seamless, Main Surface #f8faf9) -->
        <table role="presentation" class="container-table" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${mainSurface}; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.6);">
          
          <!-- 1. HERO -->
          <tr>
            <td style="position: relative; background-color: #0a3d2a; padding: 0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${heroImg}" alt="Haifly Trap No Fly Zone" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center top;" />
                  </td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(180deg, rgba(10,61,42,0.3) 0%, rgba(10,61,42,0.92) 100%), #0a3d2a; padding: 28px 36px 32px; text-align: left;">
                    <p style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: ${gold};">
                      HAIFLY TRAP &bull; EST. 2018 &bull; NIGERIA
                    </p>
                    <h1 class="hero-title" style="margin: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 32px; line-height: 38px; font-weight: 900; text-transform: uppercase; color: #ffffff; letter-spacing: -0.4px;">
                      WELCOME TO THE<br><span style="color: ${goldLight};">NO FLY ZONE</span> FAMILY.
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. WARM WELCOME LETTER FROM IFI -->
          <tr>
            <td class="mobile-padding" style="background-color: ${mainSurface}; padding: 42px 44px 34px; text-align: left;">
              <p style="margin: 0 0 14px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: ${freshGreen};">
                A personal note from Ifi
              </p>
              
              <h2 style="margin: 0 0 18px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 30px; line-height: 36px; font-weight: 900; color: ${forestGreen}; letter-spacing: -0.4px;">
                So glad you're here, <span style="color: ${onSurface};">${firstName}.</span>
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 28px; color: ${onSurface};">
                You just made a decision that your home — and everyone in it — will thank you for.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 28px; color: ${onSurface};">
                I started Haifly Trap because I was tired of watching families, restaurant owners, and poultry farmers fight a losing battle against flies and pests with products that were either toxic, ineffective, or both.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 28px; color: ${onSurface};">
                What we built is different. And now it belongs to you, too. Below are the tools we've put in your hands — your No Fly Zone officially starts today.
              </p>

              <p style="margin: 24px 0 28px 0; font-size: 14px; line-height: 22px; color: ${onSurface};">
                With love,<br>
                <strong style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 15px; color: ${forestGreen}; font-weight: 800;">Ifi — Founder, Haifly Trap</strong>
              </p>

              <!-- Pill CTA -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: ${forestGreen}; border-radius: 999px; box-shadow: 0 8px 24px rgba(15,82,56,0.28);">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 15px 38px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                      Start Shopping &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. SECTION BANNER -->
          <tr>
            <td class="mobile-padding" style="background-color: ${mainSurface}; padding: 28px 44px 10px; text-align: left;">
              <h2 style="margin: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 26px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: ${onSurface}; letter-spacing: -0.3px;">
                YOUR <span style="color: ${forestGreen};">NEW TOOLS</span> ARE WAITING.
              </h2>
            </td>
          </tr>

          <!-- 4a. PRODUCT BLOCK: HAI FLY TRAP -->
          <tr>
            <td style="background-color: ${mainSurface}; padding: 12px 0 38px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${trapImg}" alt="Hai Fly Trap" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: ${onSurface}; margin-bottom: 12px; letter-spacing: -0.3px;">
                      THE HAI FLY TRAP
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 26px; color: ${onSurface};">
                      Meet the world's first commercially viable housefly trap — built for homes, farms, restaurants, and any space that deserves to breathe clean air.
                    </p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 24px; color: #475569; font-style: italic; border-left: 3px solid ${gold}; padding-left: 14px;">
                      "The Hai Fly Trap caught thousands of flies in my poultry farm within 48 hours. No chemicals, no mess. A game changer for Nigerian farmers."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12.5px; color: #94a3b8; padding-left: 17px;">
                      — Alhaji Garba M., Commercial Poultry Owner, Kaduna
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: ${forestGreen}; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                            Get Yours &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4b. PRODUCT BLOCK: BROADKILLER SURFACE SPRAY -->
          <tr>
            <td style="background-color: ${mainSurface}; padding: 0 0 38px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${sprayImg}" alt="Broadkiller Surface Spray" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: ${onSurface}; margin-bottom: 12px; letter-spacing: -0.3px;">
                      BROADKILLER SURFACE SPRAY
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 26px; color: ${onSurface};">
                      A premium, 100% odourless botanical insecticide — safe for children, pets, and poultry. Powerful enough to end an infestation, gentle enough for daily home use.
                    </p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 24px; color: #475569; font-style: italic; border-left: 3px solid ${gold}; padding-left: 14px;">
                      "Completely odourless and incredibly effective. With toddlers at home, Broadkiller gave me peace of mind I didn't know was possible."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12.5px; color: #94a3b8; padding-left: 17px;">
                      — Mrs. Chioma O., Homeowner, Lekki Phase 1, Lagos
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: ${forestGreen}; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                            Get Yours &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4c. PRODUCT BLOCK: SAFE FOR FAMILIES & RESTAURANTS -->
          <tr>
            <td style="background-color: ${mainSurface}; padding: 0 0 40px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${safeImg}" alt="Safe for Families &amp; Restaurants" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: ${onSurface}; margin-bottom: 12px; letter-spacing: -0.3px;">
                      PROVEN SAFE. PROVEN EFFECTIVE.
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 26px; color: ${onSurface};">
                      From open-air restaurants in Abuja to poultry farms in Kaduna — Haifly Trap works wherever you need it, without compromising the health of the people and animals you love.
                    </p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 24px; color: #475569; font-style: italic; border-left: 3px solid ${gold}; padding-left: 14px;">
                      "After setting up Haifly Traps in our outdoor terrace, customer complaints about flies dropped to absolute zero. Guests eat in total comfort."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12.5px; color: #94a3b8; padding-left: 17px;">
                      — Femi A., Lounge &amp; Restaurant Manager, Abuja
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: ${forestGreen}; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                            Shop All Products &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 5. WHATSAPP STRIP -->
          <tr>
            <td class="mobile-padding" style="background-color: ${surfaceLow}; padding: 26px 44px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="56" valign="middle" style="width: 56px; padding-right: 16px;">
                    <img src="${riderImg}" alt="Delivery &amp; Support" width="50" height="50" style="display: block; width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #008f5f;" />
                  </td>
                  <td valign="middle" style="text-align: left;">
                    <strong style="display: block; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; font-weight: 800; color: ${forestGreen}; margin-bottom: 2px;">
                      I'm just one message away.
                    </strong>
                    <span style="font-size: 12px; color: #475569;">
                      Chat with Ifi &bull; Bulk farm setups &bull; Questions welcome
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #25D366; border-radius: 999px; box-shadow: 0 4px 14px rgba(37,211,102,0.3);">
                          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 11px 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 999px; white-space: nowrap;">
                            Chat on WhatsApp &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. FOOTER: EXACT MATCH TO WEBSITE FOOTER (app/src/components/Footer.tsx) -->
          <tr>
            <td style="padding: 0; background-color: ${footerBg};">
              
              <!-- Footer Wave Transition (FooterWave.tsx) -->
              <svg width="100%" height="70" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: 70px; background-color: ${surfaceLow}; vertical-align: bottom;">
                <path d="M0,60 C200,0 400,120 720,40 C1040,-40 1240,80 1440,20 L1440,201 L0,201 Z" fill="#5a9e6f"/>
                <path d="M0,100 C250,30 450,140 760,70 C1070,0 1280,110 1440,60 L1440,201 L0,201 Z" fill="#2d6e45"/>
                <path d="M0,140 C300,90 550,170 820,120 C1090,70 1320,150 1440,110 L1440,201 L0,201 Z" fill="${footerBg}"/>
              </svg>

              <!-- Main Footer Content Area -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 36px 36px 28px; background-color: ${footerBg};">
                <tr>
                  <td style="text-align: left;">
                    
                    <!-- Brand & Est 2018 -->
                    <div style="margin-bottom: 12px;">
                      <span style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 22px; font-weight: 900; letter-spacing: 5px; color: #ffffff; text-transform: uppercase;">
                        HAIFLY TRAP
                      </span>
                      <span style="color: ${gold}; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 900; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-left: 10px; vertical-align: middle;">
                        est 2018
                      </span>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 22px; color: rgba(255,255,255,0.78); max-width: 460px;">
                      Nigeria's premier eco-friendly housefly control provider. Protecting homes from Ikeja to Abuja with naturally derived solutions.
                    </p>

                    <!-- Quick Links Section (Matches website footer) -->
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${gold}; margin-bottom: 12px;">
                      Quick Links
                    </div>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="padding-right: 18px;">
                          <a href="${shopUrl}" target="_blank" style="font-size: 13px; color: rgba(255,255,255,0.85); text-decoration: none;">Shop All</a>
                        </td>
                        <td style="padding-right: 18px;">
                          <a href="${reviewsUrl}" target="_blank" style="font-size: 13px; color: rgba(255,255,255,0.85); text-decoration: none;">Our Story</a>
                        </td>
                        <td style="padding-right: 18px;">
                          <a href="${trackUrl}" target="_blank" style="font-size: 13px; color: rgba(255,255,255,0.85); text-decoration: none;">Track Order</a>
                        </td>
                        <td>
                          <a href="${shopUrl}" target="_blank" style="font-size: 13px; color: rgba(255,255,255,0.85); text-decoration: none;">Bulk Orders</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Stay Connected / Direct Support Section (Matches website footer) -->
                    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${gold}; margin-bottom: 12px;">
                      Stay Connected &bull; Direct Support
                    </div>
                    <div style="font-size: 13px; line-height: 22px; color: rgba(255,255,255,0.85); margin-bottom: 28px;">
                      <div style="margin-bottom: 8px;">
                        <span style="color: ${gold}; font-weight: bold; margin-right: 8px;">&#9742;</span>
                        <strong style="color: #ffffff; font-size: 14px;">+234 803 130 1311</strong>
                      </div>
                      <div style="margin-bottom: 8px;">
                        <span style="color: ${gold}; font-weight: bold; margin-right: 8px;">&#9993;</span>
                        <span>hello@haiflytrap.com</span>
                      </div>
                      <div>
                        <span style="color: ${gold}; font-weight: bold; margin-right: 8px;">&#9678;</span>
                        <span>Block D1181HFP, Eastline Complex, Abraham Adesanya, Ajah, Lagos</span>
                      </div>
                    </div>

                    <!-- Bottom Bar (Matches Footer.tsx line 121-132) -->
                    <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 20px; font-size: 11.5px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                      <div style="margin-bottom: 8px;">
                        &copy; 2026 Haifly Trap. Naturally Powerful Insecticide. | NAFDAC: A10-101283
                      </div>
                      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <span>Secured by <strong style="color: rgba(255,255,255,0.85);">Paystack &bull; Flutterwave</strong></span>
                        <span style="font-size: 10px; color: rgba(255,255,255,0.45);">haiflytrapng.com</span>
                      </div>
                    </div>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        <!-- End Main Email Container -->

      </td>
    </tr>
  </table>
</body>
</html>`;
};
exports.getWelcomeEmailHtml = getWelcomeEmailHtml;
//# sourceMappingURL=welcomeEmail.js.map