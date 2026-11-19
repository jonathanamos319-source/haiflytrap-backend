export interface WelcomeEmailData {
  name?: string | null;
  email: string;
}

export const getWelcomeEmailSubject = (name?: string | null): string => {
  const firstName = name?.trim() ? name.trim().split(' ')[0] : '';
  return firstName
    ? `Welcome to the family, ${firstName}! 🪰 — Ifi from Haifly Trap`
    : `Welcome to the family! 🪰 — Ifi from Haifly Trap`;
};

export const getWelcomeEmailHtml = (data: WelcomeEmailData): string => {
  const fullName = data.name?.trim() || '';
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const shopUrl = 'https://www.haiflytrapng.com/shop';
  const trackUrl = 'https://www.haiflytrapng.com/track';
  const whatsappUrl =
    'https://wa.me/2348031301311?text=' +
    encodeURIComponent('Hi Ifi, I just joined Haifly Trap and want to set up my No Fly Zone!');

  // Production image assets hosted on haiflytrapng.com
  const heroImg = 'https://www.haiflytrapng.com/images/lanscape-1.png';
  const trapImg = 'https://www.haiflytrapng.com/images/TRAPIMG1.png';
  const sprayImg = 'https://www.haiflytrapng.com/images/Broadkillersurefacespray.png';
  const safeImg = 'https://www.haiflytrapng.com/images/SAFERPOST.png';
  const riderImg = 'https://www.haiflytrapng.com/images/delivery_rider.png';

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
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0e0e0e; font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @media only screen and (max-width: 600px) {
      .container-table { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-title { font-size: 26px !important; line-height: 32px !important; }
      .prod-title { font-size: 24px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0 48px; background-color: #0e0e0e;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0e0e0e;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Container (600px Max, Seamless without divider borders) -->
        <table role="presentation" class="container-table" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.6);">
          
          <!-- 1. HERO: Full-bleed image with gradient overlay -->
          <tr>
            <td style="position: relative; background-color: #031c10; padding: 0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${heroImg}" alt="Haifly Trap No Fly Zone" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center top;" />
                  </td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(180deg, #031c10 0%, #073921 50%, #0f5238 100%); padding: 28px 32px 32px; text-align: left;">
                    <p style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #a7f3d0;">
                      HAIFLY TRAP &bull; HAIFLYTRAPNG.COM
                    </p>
                    <h1 class="hero-title" style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; line-height: 38px; font-weight: 900; text-transform: uppercase; color: #ffffff; letter-spacing: -0.5px;">
                      WELCOME TO THE<br><span style="color: #fde68a;">NO FLY ZONE</span> FAMILY.
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. WARM WELCOME LETTER FROM IFI (Seamless, No Borders) -->
          <tr>
            <td class="mobile-padding" style="background-color: #ffffff; padding: 40px 44px 32px; text-align: left;">
              <p style="margin: 0 0 14px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: #0f5238;">
                A personal note from Ifi
              </p>
              
              <h2 style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; line-height: 34px; font-weight: 900; color: #071a0e; letter-spacing: -0.3px;">
                So glad you're here, <span style="color: #0f5238;">${firstName}.</span>
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 26px; color: #374151;">
                You just made a decision that your home — and everyone in it — will thank you for.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 26px; color: #374151;">
                I started Haifly Trap because I was tired of watching families, restaurant owners, and poultry farmers fight a losing battle against flies and pests with products that were either toxic, ineffective, or both.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 26px; color: #374151;">
                What we built is different. And now it belongs to you, too. Below are the tools we've put in your hands — your No Fly Zone officially starts today.
              </p>

              <p style="margin: 24px 0 28px 0; font-size: 14px; line-height: 22px; color: #374151;">
                With love,<br>
                <strong style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #0f5238;">Ifi — Founder, Haifly Trap</strong>
              </p>

              <!-- Pill CTA -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #0f5238; border-radius: 999px; box-shadow: 0 8px 20px rgba(15,82,56,0.3);">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 15px 38px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                      Start Shopping &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. SECTION BANNER (Seamless, No Borders) -->
          <tr>
            <td class="mobile-padding" style="background-color: #ffffff; padding: 24px 44px 8px; text-align: left;">
              <h2 style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: #071a0e; letter-spacing: -0.3px;">
                YOUR <span style="color: #0f5238;">NEW TOOLS</span> ARE WAITING.
              </h2>
            </td>
          </tr>

          <!-- 4a. PRODUCT BLOCK: HAI FLY TRAP -->
          <tr>
            <td style="background-color: #ffffff; padding: 16px 0 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${trapImg}" alt="Hai Fly Trap" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: #071a0e; margin-bottom: 12px; letter-spacing: -0.3px;">
                      THE HAI FLY TRAP
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 24px; color: #374151;">
                      Meet the world's first commercially viable housefly trap — built for homes, farms, restaurants, and any space that deserves to breathe clean air.
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; line-height: 22px; color: #6b7280; font-style: italic; border-left: 3px solid #c9a84c; padding-left: 14px;">
                      "The Hai Fly Trap caught thousands of flies in my poultry farm within 48 hours. No chemicals, no mess. A game changer."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af; padding-left: 17px;">
                      — Alhaji Garba M., Poultry Owner, Kaduna
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #0f5238; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
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
            <td style="background-color: #ffffff; padding: 0 0 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${sprayImg}" alt="Broadkiller Surface Spray" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: #071a0e; margin-bottom: 12px; letter-spacing: -0.3px;">
                      BROADKILLER SURFACE SPRAY
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 24px; color: #374151;">
                      A premium, 100% odourless botanical insecticide — safe for children, pets, and poultry. Powerful enough to end an infestation, gentle enough for daily home use.
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; line-height: 22px; color: #6b7280; font-style: italic; border-left: 3px solid #c9a84c; padding-left: 14px;">
                      "Completely odourless and incredibly effective. With toddlers at home, Broadkiller gave me peace of mind I didn't know was possible."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af; padding-left: 17px;">
                      — Mrs. Chioma O., Homeowner, Lekki, Lagos
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #0f5238; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
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
            <td style="background-color: #ffffff; padding: 0 0 40px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0;">
                    <img src="${safeImg}" alt="Safe for Families &amp; Restaurants" width="600" style="display: block; width: 100%; max-width: 600px; height: 280px; object-fit: cover; object-position: center;" />
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 24px 44px 0; text-align: left;">
                    <div class="prod-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; line-height: 32px; font-weight: 900; text-transform: uppercase; color: #071a0e; margin-bottom: 12px; letter-spacing: -0.3px;">
                      PROVEN SAFE. PROVEN EFFECTIVE.
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 24px; color: #374151;">
                      From open-air restaurants in Abuja to poultry farms in Kaduna — Haifly Trap works wherever you need it, without compromising the health of the people and animals you love.
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; line-height: 22px; color: #6b7280; font-style: italic; border-left: 3px solid #c9a84c; padding-left: 14px;">
                      "After setting up Haifly Traps in our outdoor terrace, customer complaints about flies dropped to absolute zero."
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af; padding-left: 17px;">
                      — Femi A., Restaurant Manager, Abuja
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #0f5238; border-radius: 999px;">
                          <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
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

          <!-- 5. WHATSAPP STRIP (Seamless background transition) -->
          <tr>
            <td class="mobile-padding" style="background-color: #f7faf8; padding: 26px 44px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="56" valign="middle" style="width: 56px; padding-right: 16px;">
                    <img src="${riderImg}" alt="Delivery &amp; Support" width="50" height="50" style="display: block; width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #d1fae5;" />
                  </td>
                  <td valign="middle" style="text-align: left;">
                    <strong style="display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; color: #071a0e; margin-bottom: 2px;">
                      I'm just one message away.
                    </strong>
                    <span style="font-size: 12px; color: #6b7280;">
                      Chat with Ifi &bull; Bulk farm setups &bull; Questions welcome
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #25D366; border-radius: 999px; box-shadow: 0 4px 14px rgba(37,211,102,0.3);">
                          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 11px 20px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 999px; white-space: nowrap;">
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

          <!-- 6. SLEEK DARK FOOTER -->
          <tr>
            <td style="background-color: #050d07; padding: 42px 32px 36px; text-align: center;">
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 900; letter-spacing: 7px; color: #ffffff; text-transform: uppercase; margin-bottom: 20px;">
                HAIFLY TRAP
              </div>

              <!-- Pill Links -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 0 4px;">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 8px 18px; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; border-radius: 999px; text-decoration: none;">
                      Shop Traps
                    </a>
                  </td>
                  <td style="padding: 0 4px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 8px 18px; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; border-radius: 999px; text-decoration: none;">
                      WhatsApp Ifi
                    </a>
                  </td>
                  <td style="padding: 0 4px;">
                    <a href="${trackUrl}" target="_blank" style="display: inline-block; padding: 8px 18px; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; border-radius: 999px; text-decoration: none;">
                      Track Order
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Legal & Address -->
              <p style="margin: 0 0 6px 0; font-size: 11px; line-height: 18px; color: #4b5563;">
                Eastline Shopping Complex, Abraham Adesanya, Ajah, Lagos, Nigeria
              </p>
              <p style="margin: 0 0 14px 0; font-size: 10px; color: #374151;">
                &copy; 2026 Haifly Trap Nigeria. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #262626;">
                You received this email because you created an account at haiflytrapng.com.
              </p>
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
