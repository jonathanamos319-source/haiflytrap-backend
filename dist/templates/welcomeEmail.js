"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmailHtml = exports.getWelcomeEmailSubject = void 0;
const getWelcomeEmailSubject = (name) => {
    const firstName = name?.trim() ? name.trim().split(' ')[0] : '';
    return firstName
        ? `Hey ${firstName}! Welcome to the family. 🪰 — Haifly Trap`
        : `Hey! Welcome to the family. 🪰 — Haifly Trap`;
};
exports.getWelcomeEmailSubject = getWelcomeEmailSubject;
const getWelcomeEmailHtml = (data) => {
    const fullName = data.name?.trim() || '';
    const firstName = fullName ? fullName.split(' ')[0] : '';
    const greetingHeadline = firstName ? `Hey ${firstName}! Welcome to the family.` : 'Hey! Welcome to the family.';
    const shopUrl = 'https://www.haiflytrapng.com/shop';
    const whatsappUrl = 'https://wa.me/2348031301311';
    const homeUrl = 'https://www.haiflytrapng.com/';
    // Public asset paths on haiflytrapng.com
    const logoUrl = 'https://www.haiflytrapng.com/haifly/logo.webp';
    const trapImgUrl = 'https://www.haiflytrapng.com/haifly/hai-fly-trap.png';
    const broadkillerImgUrl = 'https://www.haiflytrapng.com/haifly/broadkiller.png';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Haifly Trap</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=Libre+Caslon+Text:ital@1&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #e8ebe4;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #153f35;
      -webkit-font-smoothing: antialiased;
    }
    .font-display { font-family: 'Bebas Neue', 'DM Sans', Arial, sans-serif; }
    .font-serif { font-family: 'Libre Caslon Text', Georgia, serif; }
    .eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.19em;
      text-transform: uppercase;
    }
    .text-link {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #153f35;
      text-decoration: none;
    }
    .hero-orbit {
      position: absolute;
      border: 1px solid rgba(246, 201, 0, 0.23);
      border-radius: 999px;
      pointer-events: none;
    }
    .hero-orbit-one {
      top: 38px;
      right: -190px;
      width: 520px;
      height: 520px;
    }
    .hero-orbit-two {
      top: 110px;
      right: -115px;
      width: 370px;
      height: 370px;
    }
    @media only screen and (max-width: 639px) {
      .container-table { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-title { font-size: 56px !important; line-height: 0.9 !important; }
      .hero-orbit-one { right: -330px !important; }
      .hero-orbit-two { right: -245px !important; }
      .grid-stack { display: block !important; width: 100% !important; }
      .pillar-col { display: block !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(21,63,53,0.1) !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0 48px; background-color: #e8ebe4;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #e8ebe4;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Container (760px Max) -->
        <table role="presentation" class="container-table" width="760" border="0" cellspacing="0" cellpadding="0" style="max-width: 760px; width: 100%; background-color: #fffdf7; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 70px rgba(20,58,48,0.16);">
          
          <!-- Top Yellow Promo Bar -->
          <tr>
            <td align="center" style="background-color: #f6c900; padding: 12px 20px; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #123d33;">
                Welcome to the no fly zone &bull; Since 2018
              </p>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="border-bottom: 1px solid rgba(23,63,53,0.1); background-color: #fffdf7; padding: 18px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${homeUrl}" target="_blank" style="text-decoration: none;">
                      <img src="${logoUrl}" alt="Haifly Trap" width="160" style="display: block; height: 52px; width: auto; object-fit: contain;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <a href="${shopUrl}" target="_blank" class="text-link" style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #153f35; text-decoration: none;">
                      Shop solutions &nearr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="position: relative; overflow: hidden; background-color: #123f35; padding: 48px 36px 0; color: #ffffff;">
              <div class="hero-orbit hero-orbit-one"></div>
              <div class="hero-orbit hero-orbit-two"></div>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="position: relative; z-index: 10;">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #f6c900; margin: 0 0 14px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      A note from our founder
                    </p>
                    <h1 class="hero-title font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 78px; line-height: 0.88; letter-spacing: -0.02em; text-transform: uppercase; margin: 0 0 18px 0; color: #ffffff; max-width: 590px;">
                      ${greetingHeadline}
                    </h1>
                    <p style="margin: 0; font-size: 17px; line-height: 28px; color: rgba(255,255,255,0.8); max-width: 500px;">
                      Your home—and everyone in it—will thank you for choosing a cleaner, smarter way to keep pests out.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px; position: relative;">
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); height: 120px; width: 80%; border-radius: 50%; background-color: rgba(246,201,0,0.8); filter: blur(2px);"></div>
                    <img src="${trapImgUrl}" alt="Haifly Trap eco-friendly housefly trap" width="560" style="display: block; position: relative; z-index: 10; width: 92%; max-width: 560px; filter: drop-shadow(0 24px 24px rgba(0,0,0,0.26)); margin: 0 auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Letter Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #fffdf7; padding: 56px 44px;">
              <p class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 48px; line-height: 1; text-transform: uppercase; color: #153f35; margin: 0 0 24px 0;">
                So glad you're here.
              </p>
              
              <div style="font-size: 15px; line-height: 28px; color: #49635c; margin-bottom: 32px;">
                <p style="margin: 0 0 18px 0;">
                  I started Haifly Trap because I was tired of watching families, restaurant owners, and poultry farmers fight a losing battle against flies and pests with products that were either toxic, ineffective, or both.
                </p>
                <p style="margin: 0 0 18px 0;">
                  What we built is different. Naturally derived, proudly Nigerian, and made to work without making your home feel like a chemical zone.
                </p>
                <p style="border-left: 4px solid #f6c900; padding-left: 18px; font-weight: 700; color: #153f35; margin: 0;">
                  And now it belongs to you, too. Your No Fly Zone officially starts today.
                </p>
              </div>

              <div>
                <p class="font-serif" style="font-family: 'Libre Caslon Text', Georgia, serif; font-size: 24px; font-style: italic; color: #153f35; margin: 0 0 4px 0;">
                  With love,
                </p>
                <p style="font-size: 14px; font-weight: 800; letter-spacing: 0.04em; color: #153f35; margin: 0;">
                  Ifi — Founder, Haifly Trap
                </p>
              </div>
            </td>
          </tr>

          <!-- 3 Pillars Section (Naturally derived, Proven protection, Made in Nigeria) -->
          <tr>
            <td style="border-top: 1px solid rgba(21,63,53,0.1); border-bottom: 1px solid rgba(21,63,53,0.1); background-color: #f2f5ef; padding: 0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="pillar-col" width="33%" valign="top" style="padding: 32px 28px; border-right: 1px solid rgba(21,63,53,0.1);">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">01</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Naturally derived
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Thoughtful formulas built for the spaces you live and work in.
                    </p>
                  </td>
                  <td class="pillar-col" width="33%" valign="top" style="padding: 32px 28px; border-right: 1px solid rgba(21,63,53,0.1);">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">02</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Proven protection
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Practical pest control for homes, farms, kitchens, and businesses.
                    </p>
                  </td>
                  <td class="pillar-col" width="34%" valign="top" style="padding: 32px 28px;">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">03</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Made in Nigeria
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Locally built expertise, trusted by families and professionals since 2018.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Yellow CTA Banner (Build your no fly zone) -->
          <tr>
            <td class="mobile-padding" align="center" style="background-color: #f6c900; padding: 56px 36px; text-align: center;">
              <p class="eyebrow" style="color: #153f35; margin: 0 0 12px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                Ready when you are
              </p>
              <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 64px; line-height: 0.95; text-transform: uppercase; color: #153f35; margin: 0 auto 18px; max-width: 560px;">
                Build your no fly zone.
              </h2>
              <p style="margin: 0 auto 32px; max-width: 500px; font-size: 15px; line-height: 24px; color: rgba(21,63,53,0.85);">
                Explore effective solutions for everyday protection—from the world's first commercially viable housefly trap to botanical surface sprays.
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="background-color: #153f35; border-radius: 999px;">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                      Start shopping &nearr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meet The Range Section (2 Product Cards) -->
          <tr>
            <td class="mobile-padding" style="background-color: #fffdf7; padding: 56px 44px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #c69c00; margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      Haifly essentials
                    </p>
                    <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 54px; line-height: 1; text-transform: uppercase; color: #153f35; margin: 0;">
                      Meet the range.
                    </h2>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="${shopUrl}" target="_blank" class="text-link" style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #153f35; text-decoration: none;">
                      See all &nearr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Product Cards Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Card 1: Hai Fly Trap -->
                  <td class="grid-stack" width="48%" valign="top" style="padding-right: 12px; padding-bottom: 20px;">
                    <a href="${shopUrl}" target="_blank" style="text-decoration: none; display: block; border: 1px solid rgba(21,63,53,0.12); border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                      <div style="background-color: #edf1e9; padding: 24px; text-align: center; height: 180px;">
                        <img src="${trapImgUrl}" alt="Hai Fly Trap" style="max-height: 160px; max-width: 100%; width: auto; height: auto; object-fit: contain; margin: 0 auto; display: block;" />
                      </div>
                      <div style="padding: 18px;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: #71827d; text-transform: uppercase;">
                          Indoor &amp; outdoor
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #153f35;">
                            Hai Fly Trap
                          </h3>
                          <span style="font-weight: bold; color: #153f35;">&nearr;</span>
                        </div>
                      </div>
                    </a>
                  </td>

                  <!-- Card 2: Broadkiller Spray -->
                  <td class="grid-stack" width="48%" valign="top" style="padding-left: 12px; padding-bottom: 20px;">
                    <a href="${shopUrl}" target="_blank" style="text-decoration: none; display: block; border: 1px solid rgba(21,63,53,0.12); border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                      <div style="background-color: #edf1e9; padding: 24px; text-align: center; height: 180px;">
                        <img src="${broadkillerImgUrl}" alt="Broadkiller Spray" style="max-height: 160px; max-width: 100%; width: auto; height: auto; object-fit: contain; margin: 0 auto; display: block;" />
                      </div>
                      <div style="padding: 18px;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: #71827d; text-transform: uppercase;">
                          Botanical formula
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #153f35;">
                            Broadkiller Spray
                          </h3>
                          <span style="font-weight: bold; color: #153f35;">&nearr;</span>
                        </div>
                      </div>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WhatsApp Recommendation Section -->
          <tr>
            <td class="mobile-padding" style="position: relative; overflow: hidden; background-color: #153f35; padding: 56px 44px; color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #f6c900; margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      Need a quick recommendation?
                    </p>
                    <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 54px; line-height: 0.95; text-transform: uppercase; color: #ffffff; margin: 0 0 16px 0;">
                      Let's talk pests.
                    </h2>
                    <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 24px; color: rgba(255,255,255,0.75); max-width: 440px;">
                      Tell us what you're dealing with and where. Our team will help you choose the right Haifly solution.
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #f6c900; border-radius: 999px;">
                          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #153f35; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                            Chat on WhatsApp &nearr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="mobile-padding" style="background-color: #0d3028; padding: 40px 36px; color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 28px;">
                <tr>
                  <td align="left" valign="middle">
                    <img src="${logoUrl}" alt="Haifly Trap" width="140" style="display: block; height: 46px; width: auto; object-fit: contain; filter: brightness(0) invert(1);" />
                  </td>
                  <td align="right" valign="middle">
                    <a href="${shopUrl}" target="_blank" style="color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; margin-left: 18px;">
                      Shop
                    </a>
                    <a href="mailto:hello@haiflytrap.com" style="color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; margin-left: 18px;">
                      Email us
                    </a>
                    <a href="${whatsappUrl}" target="_blank" style="color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; margin-left: 18px;">
                      WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding-top: 24px; font-size: 11px; line-height: 20px; color: rgba(255,255,255,0.52);">
                <tr>
                  <td align="left" valign="top">
                    Haifly Trap &bull; Est. 2018 &bull; NAFDAC: A10-101283<br>
                    Block D1181HFP, Eastline Complex, Abraham Adesanya, Ajah, Lagos
                  </td>
                  <td align="right" valign="top">
                    +234 803 130 1311<br>
                    hello@haiflytrap.com
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