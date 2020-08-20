import { Component } from '@angular/core'

import { ScoresTemplateComponent } from '../score/score-template'
import { Statistic } from '../statistic/statistic'
import { StatisticsService } from '../statistics/statistics.service'

/**
 * Display the high scores
 */
@Component({
  selector: 'app-high-scores',
  templateUrl: '../score/score-template.component.html',
  styleUrls: ['../score/score-template.component.scss']
})
/**
 * Display the high scores
 */
export class HighScoresComponent implements ScoresTemplateComponent {
  /**
   * Receive the scores from `HighScoresService`
   */
  public get scores(): Statistic[] {
    return this.statistics.highScores
  }

  /**
   * Title to show.
   */
  public title: string = 'High Scores'

  /**
   * First Column name.
   */
  public column: string = 'Rank'

  constructor(public statistics: StatisticsService) {}
}
