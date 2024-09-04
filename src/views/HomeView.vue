<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card mt-4 mb-4 shadow">
          <div class="card-header">
            <h4 class="card-title">
              <i class="bi bi-house"></i> Willkommen - Anleitung für das PV TOOL
            </h4>
            <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Sub</h6> -->
          </div>
          <div class="card-body">
            <ol>
              <li>
                <strong>Wechselrichter oder Gerät mit integriertem MPPT anlegen</strong>
                <ol>
                  <li>
                    Wählen Sie die Option, einen vordefinierten Wechselrichter oder ein Gerät mit
                    integriertem MPPT (Maximum Power Point Tracking) anzulegen.
                  </li>
                  <li>
                    Oder geben Sie die folgenden Daten für Ihren Wechselrichter/das Gerät ein:
                    <ul>
                      <li>
                        <strong>Spannung:</strong> Nennspannung des Wechselrichters oder des Geräts.
                      </li>
                      <li>
                        <strong>Strom:</strong> Nennstrom, der vom Wechselrichter oder Gerät
                        verarbeitet werden kann.
                      </li>
                      <li>
                        <strong>Leistung (Watt):</strong> Maximale Leistung, die das Gerät
                        verarbeiten kann.
                      </li>
                      <li>
                        <strong>Anzahl der MPPTs:</strong> Anzahl der verfügbaren MPPT-Eingänge im
                        Gerät.
                      </li>
                    </ul>
                  </li>
                </ol>
              </li>
              <li>
                <strong>Solarpanele anlegen</strong>
                <ol>
                  <li>
                    Wählen Sie die Option, Solarpanele anlegen (selbst Daten eingaben) oder treffen
                    Sie aus vordefinierten Solarpanelen ein Auswahl. Es können grundlegend beliebig
                    viele Solarpanele angelegt werden.
                  </li>
                  <li>
                    Geben Sie die folgenden Daten für das Solarpanel ein:
                    <ul>
                      <li>Name / Bezeichnung</li>
                      <li>max. Betriebsspannung (Vmp) sowie max. Betriebsstrom (Imp)</li>
                      <li>
                        <strong>Leerlaufspannung (Voc):</strong> Spannung, die das Panel ohne Last
                        erzeugt - wichtigste Kennzahl.
                      </li>
                      <li><strong>Strom (Isc):</strong> Kurzschlussstrom des Panels.</li>
                      <li>
                        <strong>Leistung (Watt):</strong> Maximale Leistung, die das Panel unter
                        optimalen Bedingungen liefert.
                      </li>
                    </ul>
                  </li>
                </ol>
              </li>
              <li>
                <strong>MPPTs mit Solarpanelen verbinden</strong>
                <ol>
                  <li>Ordnen Sie die angelegten Solarpanele den jeweiligen MPPT-Eingängen zu.</li>
                  <li>
                    Der Rechner zeigt an, ob das Solarpanel bzw. die Konfiguration der Solarpanele
                    für den MPPT-Eingang geeignet ist.
                  </li>
                  <li>
                    Falls mehrere Panele verwendet werden, werden diese in einem sogenannten
                    <strong>String</strong> (Reihenschaltung) verbunden. Es können maximal zwei
                    Strings generiert werden.
                  </li>
                  <li>
                    Falls mehrere, aber unterschiedliche Panele verwendet werden, werden diese in
                    einem sogenannten
                    <strong>Gruppen</strong> angezeigt. Gruppen können nicht untereinander verbunden
                    werden, sondern jede Gruppe ist jeweils am MPPT möglich.
                  </li>
                  <li>
                    Wenn zwei Strings generiert wurden, werden diese dann parallel geschaltet. Diese
                    Parallelverbindung zeigt das PV Tool automatisch mit einem Hinweis an.
                  </li>
                </ol>
              </li>
              <li>
                <strong>Ergebnisse überprüfen</strong>
                <ol>
                  <li>
                    Überprüfen Sie die Anzeige des PV Tools, um sicherzustellen, dass die
                    Solarpanel-Konfiguration optimal ist und den Anforderungen des
                    Wechselrichters/MPPTs entspricht.
                  </li>
                  <li>
                    Falls Anpassungen notwendig sind, ändern Sie die Konfiguration der Panele oder
                    der MPPT-Eingänge entsprechend.
                  </li>
                </ol>
              </li>
            </ol>
            <div class="alert alert-success" role="alert">
              <strong>Info:</strong> Es können jederzeit angelegte Daten (Wechselrichter und
              Solarpanele) geändert, editiert, dupliziert oder gelöscht werden, solange die Geräte
              und Panele noch nicht als Verbindung angelegt sind. Stellen Sie sicher, dass alle
              Einstellungen überprüft sind, bevor Sie die Verbindungen vornehmen.
            </div>
            <div class="alert alert-warning" role="alert">
              <strong>Hinweis zur Berechnung:</strong> Bei der Berechnung wird intern 10% von der
              Spannung des MPPT abgezogen, um Schwankungen, insbesondere die erhöhte
              Leerlaufspannung der Solarpanele im Winter, zu berücksichtigen. Das bedeutet, dass
              beispielsweise bei einer MPPT-Spannung von 150 V die Berechnungsgrundlage 135 V
              beträgt. Diese angepasste Spannung wird verwendet, um zu überprüfen, ob die Panele
              oder Strings passend sind.
            </div>

            <div class="alert alert-danger" role="alert">
              <strong>Wichtiger Hinweis:</strong> Das PV Tool befindet sich noch im Beta-Stadium und
              ist ausschließlich für kleine Solaranlagen - z. B. Balkonkraftwerke - gedacht. Für die
              Richtigkeit und Vollständigkeit der Verbindungsdaten wird keine Haftung übernommen.
              Verwenden Sie das Tool daher auf eigene Verantwortung.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
