import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview.component';
import {ProgressComponent} from '../deploy/component/progress/progress.component';
import {CharsComponent} from './chars/chars.component';
import {CoreModule} from '../core/core.module';
import {DescribeComponent} from './describe/describe.component';
import {TermComponent} from '../deploy/component/term/term.component';
import {OperaterComponent} from '../deploy/component/operater/operater.component';

@NgModule({
  declarations: [OverviewComponent, CharsComponent, DescribeComponent],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class OverviewModule {
}
