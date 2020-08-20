import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { HighScoresComponent } from '../high-scores/high-scores.component'
import { RecentScoresComponent } from '../recent-scores/recent-scores.component'
import { RootComponent } from './root.component'
import { StatisticsComponent } from '../statistics/statistics.component'
import { StopwatchComponent } from '../stopwatch/stopwatch.component'

/**
 * Entry Module
 */
@NgModule({
  declarations: [
    RootComponent,
    HighScoresComponent,
    RecentScoresComponent,
    StatisticsComponent,
    StopwatchComponent
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [RootComponent]
})
/**
 * Entry Module
 */
export class RootModule {}