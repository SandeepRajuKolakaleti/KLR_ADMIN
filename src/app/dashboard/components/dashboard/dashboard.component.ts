import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonBaseComponent } from '../../../shared/components/common-base/common-base.component';
import { CommonService } from '../../../shared/services/common/common.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { TranslateConfigService } from '../../../shared/services/translate/translate-config.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent extends CommonBaseComponent implements AfterViewInit {

  constructor(private commonService: CommonService, private  translate: TranslateService,
    protected override storageService: StorageService, 
      protected override translateConfigService: TranslateConfigService,) {
        super(translateConfigService, translate, storageService);
        super.ngOnInit();
      }

  ngAfterViewInit(): void {
    this.translate.get('DASHBOARD.NAME').subscribe(value => {
      console.log('Translated value:', value);
    });
  }

}
