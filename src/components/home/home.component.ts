import { Component } from '@angular/core';
import { SearchComponent } from "../search/search.component";
import { EncryptionService } from '../../services/encryption-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
;
constructor(private Encryption_Service: EncryptionService){
  // localStorage.setItem("userID", this.Encryption_Service.encryptData("212674303"));
  const encryptedId = this.Encryption_Service.encryptData("YF7410!!"); // הצפנה
}
}
