import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BoraApiService } from '../bora-api.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent {
  @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;
  markers: Marker[] = [];
  poa: google.maps.LatLngLiteral = { lat: -30.0346, lng: -51.2177 };// Coordenadas para Porto Alegre, Brasil
  boraWork: google.maps.LatLngLiteral = { lat: -30.0540572, lng: -51.1477079 };// Coordenadas para Porto Alegre, Brasil
  pucCarreiras: google.maps.LatLngLiteral = { lat: -30.0446776, lng: -51.218274 };// Coordenadas para Porto Alegre, Brasil
  center: google.maps.LatLngLiteral = this.boraWork;

  mapOptions: google.maps.MapOptions = {
    center: this.pucCarreiras,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: true,
    zoomControl: false,
  };

  constructor(private boraApiService: BoraApiService) { }
  ngAfterViewInit(): void {
    if(this.googleMap){
      var placesService = new google.maps.places.PlacesService(this.googleMap.googleMap!);
      var request = {
          //query: 'bora.work, Porto Alegre, Brazil',
          query: 'PUC Carreiras, Porto Alegre, Brazil',
          fields: ['place_id', 'geometry', 'name']
      };

      placesService.findPlaceFromQuery(request, (places: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              const place = places![0];
              const marker = new google.maps.Marker({
                map: this.googleMap.googleMap,
                title: place.name,
                position: place.geometry?.location,
              });
              marker.addListener('click', () => {
                const partnerId = Math.floor(Math.random() * 2) + 1;
                if(partnerId == 1)
                  this.openBoraWork(marker, place);
                else if(partnerId == 2)
                  this.openBoraSocial(marker, place);
              });
              if(!['bora.work','localhost'].includes(window.location.hostname))
                this.openBoraWork(marker, place);
              else
                this.openBoraSocial(marker, place);
          }
      });
    }
  }

  openBoraWork(marker: google.maps.Marker, place: google.maps.places.PlaceResult): void {
    const calendarAuthorized = true;
    this.boraApiService.getPartners(calendarAuthorized, -30, (partners=>{
      if(partners){
        const partnersNotDirectors = partners.filter(p=>p.username != 'bora.work' && p.username != 'lucasfogliarini');
        const featuredPartner = partnersNotDirectors.length ? partnersNotDirectors[0] : partners[1];
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h5 class='text-center'>Bora.Work</h5>
              <h6 class='text-center'>Capacitando Profissionais para as melhores soluções do mercado.</h6>
              <br/>
              <nav class="text-center">
                <a class='btn btn-dark' href="/bora.work">Encontros</a>
                <a class='btn btn-white btn-outline-secondary' href="${featuredPartner.username}">
                  ${featuredPartner.name} <small style='font-size: xx-small'>(${featuredPartner.accountability})</small>
                </a>
              </nav>
              <br/>
              <p>
                <b>Bora.work</b> é uma <b>Academia</b> de <b>profissionais</b> <a target='_blank' href='/bora.work?find=Bora Parceiros'>Parceiros</a> e de <a target='_blank' href='/bora.work?find=tech'>Tecnologia.</a>
                <br />
                O propósito desta Academia é reunir e capacitar profissionais, expandindo nosso time <b>operacional</b> e de <b>liderança</b>, para continuar a <b><a target='_blank' href='https://bora.social'>produção de aplicativos inovadores</a></b> e a <b>organização de reuniões de qualquer natureza: palestras, cursos, workshops, reuniões de negócio, ...</b>
                <br/>
                <br/>
                Com frequência participamos de <a target='_blank' href='/bora.work?withTicket=true'>palestras, workshops e cursos presenciais</a> de diversos produtores para <b>expandir o networking</b> e <b>discutir gestão e liderança</b>.
                <br/>
                <br/>
                Atuamos em diversos locais, como <b>Universidades (PUCRS e Unisinos), coworkings, casas, restaurantes e plataformas digitais (<a target='_blank' href='https://meet.google.com'>Google Meet</a>, <a target='_blank' href='https://horizon.meta.com/profile/lucasfogliarini/'>Metaverso</a>, <a target='_blank' href='https://discord.gg/Yf4TCsSTG5'>Discord</a>, <a target='_blank' href='https://chat.whatsapp.com/I7ggwNVQp6I2yWCgMC9Evs'>WhatsApp</a>, <a target='_blank' href='https://www.linkedin.com/in/lucasfogliarini/'>Linkedin</a> e <a target='_blank' href='https://vamo.atlassian.net/jira/software/projects/BORA/boards/1/timeline'>Jira</a>)</b>.
                <br/>
                <br/>
                Proporcionamos <b>experiências únicas</b> que <b>conectam pessoas</b>, promovendo o crescimento <b>profissional</b> e a <b>expansão</b> da rede de contatos em ambientes acolhedores e confortáveis. Junte-se a nós e descubra como <b>transformar suas ideias em realidade.</b>
                <br/>
                <br/>
                A <b>meta</b> é transformar os <b>valores, virtudes e inteligência da sociedade</b> para que ela se torne mais <b>respeitosa, justa, colaborativa e confiante</b>. Dessa forma, não teremos mais grandes problemas causados por <i>egoísmos, ódio, revoltas e até desastres naturais</i> que fazem tantas <b>crianças, idosos e até adultos</b> chorarem por <b>paz</b>.
              </p>              
              <div class='text-center'>
                <a target='_blank' role='button' href='https://chatgpt.com/share/c800bc1d-0a92-4a76-9fae-5439353bf023' class='btn btn-white btn-outline-secondary' >ChatGPT sobre o bora.work</a>
                <br />
                <br />
                <small>A maioria dos encontros presenciais são em Porto Alegre no</small>
                <br />
                <br />
                <a class='btn btn-white btn-outline-secondary' target='_blank' href='https://www.google.com/maps/search/?api=1&query=PUC Carreiras, Porto Alegre'>Ágora <small>(PUC Carreiras)</small></a>
                <br />
                ⬇️
              </div>
              <br/>
            </div>
          `
        });
        infoWindow.open(this.googleMap.googleMap, marker);
      }
    }));
  }

  openBoraSocial(marker: google.maps.Marker, place: google.maps.places.PlaceResult): void {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h5 class='text-center'>Bora Social</h5>
          <h6 class='text-center'>Organizadora de eventos presenciais e virtuais em Porto Alegre e região</h6>
          <br/>
          <nav class="text-center">
            <a class='btn btn-dark' target='_blank' href="/lucasfogliarini?find=banquete">🍾 Bora Banquete? 🍖</a>
            <a class='btn btn-white btn-outline-secondary' href="/lucasfogliarini">Encontros</a>
          </nav>
          <br/>
          O <b>bora.social</b> é uma <b>organizadora de eventos presenciais e virtuais em Porto Alegre e região.</b>
          <br/>
          <br/>
          E também um <a target='_blank' href='https://www.youtube.com/@lucasfogliarini'>Pod Cast</a> que cria conteúdos com o <b>Oculus</b> 🥽
          <br/>
          <br/>
          E além, é uma <b>organização de encontros de estrelas e lendas do entretenimento ...</b>
          <br/>
          <br/>
          <ul style='list-style-type: none; padding: 0'>
            <li><a href='/lucasfogliarini?withTicket=true'>🎭 Shows, Teatros e Festivais</a> (em Porto Alegre e região)</li>
            <li><a href='/lucasfogliarini?find=banquete'>🍖 Bora Banquete</a> (banquete entre amigos)</li>
            <li><a href='/lucasfogliarini?find=camarote'>🍾 Bora Camarote</a> (camarotes em festas)</li>
            <li><a href='/lucasfogliarini?find=Jam'>🎼 Bora Jam</a> (festas privadas)</li>
            <li><a href='/lucasfogliarini?find=🥳'>🥳 Bora Celebrar</a> (aniversários)</li>
            <li><a href='/lucasfogliarini?find=timeleft'>🤔 Bora Timeleft</a> (encontro com desconhecidos)</li>
            <li><a href='/lucasfogliarini?find=jogatina'>🃏 Bora Jogatina</a> (Poker e The Resistence)</li>
            <li><a href='/lucasfogliarini?find=xadrez'>♟️ Bora Xadrez</a> (todos ratings)</li>
            <li><a href='/lucasfogliarini?find=Bola'>⚽ Bora Bola</a> (futebol nos parques)</li>
            <li><a href='/lucasfogliarini?find=tribe'>🥽 Bora Tribe DJ 🎧</a> (festa virtual)</li>
            <li><a href='/lucasfogliarini?find=chess'>🥽 Bora Chess Club</a> (xadrezinho virtual)</li>
          <ul>
          <br/>
        </div>
      `
    });

    infoWindow.open(this.googleMap.googleMap, marker);
  }
}

interface Marker {
  position: google.maps.LatLng;
  title: string;
  content?: string;
  showInfo?: boolean;
}