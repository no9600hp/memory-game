import { Component } from '@angular/core'

import { ScoresTemplateComponent } from '../score/score-template'
import { Statistic } from '../statistic/statistic'
import { StatisticsService } from '../statistics/statistics.service'

/**
 * Display the recent scores
 */
@Component({
  selector: 'app-recent-scores',
  templateUrl: '../score/score-template.component.html',
  styleUrls: ['../score/score-template.component.scss']
})
/**
 * Display the recent scores
 */
export class RecentScoresComponent implements ScoresTemplateComponent {
  /**
   * Receive the scores from `RecentScoresService`
   */
  public get scores(): Statistic[] {
    return this.statistics.recentScores
  }

  /**
   * Title to show.
   */
  public title: string = 'Recent Scores'

  /**
   * First Column name.
   */
  public column: string = 'Recent'

  constructor(public statistics: StatisticsService) {}
}
