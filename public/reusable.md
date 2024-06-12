<script>
    let dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    let sleeptime = [400,420,440,370,350,300,350,400,450,500,550,540,530,290,310,370,395,405,455,599,400,402,500,433,399,311,509,444,489,388,480];
    let tea = [0,1,0,1,1,1,0,1,1,0,0,0,0,1,0,1,0,0,0,1,1,0,1,0,1,1,1,1,0,0,1];
    let coffee = [1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,0,0];
    let days = dates.length;
    let screentime = [180,200,222,111,120,130,170,250,300,100,50,77,85,105,119,170,240,268,204,390,409,200,201,288,432,321,250,333,222,118,123];
    let bedtime = [0,1,1.2,1.3,1.5,2,2.2,2.4,2.9,3,1.4,5,5.45,1.11,2.33,4.3,2.33,3,1,0.55,0.99,4,3,2,3.44,4.33,5,5.99,3,3,2.65];
</script>
<script>

    const get_formatted_time = function(x) {
        let mins = x%60;
        if (hours == 0) {
            return mins + ' minuites';
        }
        else {
            return hours + ' hours ' + mins + ' minuites';
        }
    }

    const get_bedtime = function(y) {
        let hours = Math.floor(y);
        let z = Math.round((y - Math.floor(y))*100);
        let mins = Math.round(z*0.6);
        return hours + ':' + mins;
    }

</script>

# Health
## Food Consumption
- **Breakfast:** Dine-out: 8, Ordered: 7, Left-over: 1, Self-Cooked: 1
- **Lunch:** Ordered: 14, Self-Cooked: 8, Dine-out: 5, Cook: 1
- **Dinner:** Cook (Home-cooked presumably): 21, Ordered: 5, Dine-out: 1, Mixed (Cook, Ordered): 1, Self: 1, Self-Cooked: 1
- **Home-cooked meals:** 33
- **Ordred/Restaurant meals:** 42

<div>
  <canvas id="myChart4"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>

	const DATA_COUNT = 12;
    const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
    
    const labels = [];
    const data4 = {
      labels: ['Dine-out', 'Self-Cooked', 'Cook', 'Ordered'],
      datasets: [
        {
		      label: 'Dinner',
          backgroundColor: ['#DDDBDE', '#CAD4DF', '#656E77', '#3B373B'],
          data: [20, 40, 10, 30]
        },
        {
		      label: 'Lunch',
          backgroundColor: ['#DDDBDE', '#CAD4DF', '#656E77', '#3B373B'],
          data: [33, 40, 10, 13]
        },
        {
		      label: 'Breakfast',
          backgroundColor: ['#DDDBDE', '#CAD4DF', '#656E77', '#3B373B'],
          data: [20, 35, 30, 15]
        }
        
      ]
    };


	const config2 = {
      type: 'doughnut',
      data: data4,
      options: {
		aspectRatio: 3,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              generateLabels: function(chart) {
                // Get the default label list
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);
    
                // Build an array of colors used in the datasets of the chart
                let datasetColors = chart.data.datasets.map(function(e) {
                  return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();
                return labelsOriginal;
              }
            },
            onClick: function(mouseEvent, legendItem, legend) {
              // toggle the visibility of the dataset from what it currently is
              legend.chart.getDatasetMeta(
                legendItem.datasetIndex
              ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
              legend.chart.update();
            }
          },
          tooltip: {
            callbacks: {
            }
          }
        }
      },
    };

	const ctx4 = document.getElementById('myChart4');
	new Chart(ctx4, config2);

	
</script>


### Tea/Coffee intake
* Had tea and/or coffee <p id = 'coffe_count' style="display:inline"> </p> out of 30 days this month

<div>
  <canvas id="myChart1"></canvas>
</div>



<script>
    
    
    let t = 0, c = 0, both = 0, none = 0;
    for (let i = 0; i < days; i++) {
        if (tea[i] == 0 && coffee[i] == 0) {
            none++;
        }
        else if (tea[i] == 1 && coffee[i] == 0) {
            t++;
        }
        else if (tea[i] == 0 && coffee[i] == 1) {
            c++;
        }
        else {
            both++;
        }
    }
    document.getElementById('coffe_count').innerHTML = String(c);

  let array = [c,t,none,both];  
  const ctx1 = document.getElementById('myChart1');


  const data = {
    labels: [
      'Coffee only',
      'Tea only',
      'None',
	  'Both'
    ],
    datasets: [{
      label: 'Tea/Coffee intake',
      data: array,
      backgroundColor: [
        '#DDDBDE',
        '#CAD4DF',
        '#656E77',
		    '#3B373B'
      ],
      hoverOffset: 4
    }]
  };

  const config = {
     type: 'doughnut',
     data: data,
	 options: {
		aspectRatio: 3
	 }
  };

  new Chart(ctx1, config);
    
</script>


### Desert and Snacks
* Had a medium to heavy Desert 15 out of 30 days
* Had snacks (Other than fruit/nuts and other meals) 3 out of 30 days.

## Workouts
* Worked out <p id = 'total_count' style="display:inline"> </p> times out of 30 this month.
	- Shoulders (S): <p id = 'S_count' style="display:inline"> </p> sessions
	- Back and Biceps (B&B): <p id = 'BnB_count' style="display:inline"> </p> sessions
	- Chest and Triceps (C&T): <p id = 'CnT_count' style="display:inline"> </p> sessions
	- Leg day (L): <p id = 'L_count' style="display:inline"> </p> sessions
- Longest consecutive days worked out: <p id = 'maxcons_count' style="display:inline"> </p>
- Longest consecutive days of break: <p id = 'maxbreak_count' style="display:inline"> </p>

## Sleep
- **Mean Sleep Duration:** <p id = 'mean_sleeptime_count' style="display:inline"> </p> 
- **Median Sleep Duration:** <p id = 'median_sleeptime_count' style="display:inline"> </p> 
- **Minimum Sleep Duration:** <p id = 'min_spt_count' style="display:inline"> </p> 
- **Maximum Sleep Duration:** <p id = 'max_spt_count' style="display:inline"> </p> 
- **Mean Bedtime:** <p id = 'mean_bt' style="display:inline"> </p> AM
- **Median Bedtime:** <p id = 'median_bt' style="display:inline"> </p> AM
- **Minimum Bedtime:** <p id = 'min_bt' style="display:inline"> </p> AM
- **Maximum Bedtime:** <p id = 'max_bt' style="display:inline"> </p> AM

<div>
  <canvas id="myChart2"></canvas>
</div>



<script>

  const ctx2 = document.getElementById('myChart2');

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Total sleep duration (minutes)',
        data: sleeptime,
        borderWidth: 1,
        borderColor: '#656E77',
        backgroundColor: '#656E77'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


</script>

<div>
  <canvas id="myChart5"></canvas>
</div>

<script>

  
  const data5 = {
    labels: dates,
    datasets: [{
      label: 'Bedtime (decimal hours in am)',
      data: bedtime,
      fill: false,
      borderColor: '#3B373B',
      tension: 0
    }]
  };  

  const config5 = {
    type: 'line',
    data: data5,
  };

  const ctx5 = document.getElementById('myChart5');
  new Chart(ctx5, config5);



</script>


## Screen time (Phone)
- **Mean Screen Time:** <p id = 'mean_screentime_count' style="display:inline"> </p>
- **Median Screen Time:** <p id = 'median_screentime_count' style="display:inline"> </p>
- **Minimum Screen Time:** <p id = 'min_sct_count' style="display:inline"> </p>
- **Maximum Screen Time:** <p id = 'max_sct_count' style="display:inline"> </p>

<div>
  <canvas id="myChart3"></canvas>
</div>

<script>

  const ctx3 = document.getElementById('myChart3');

  new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Screen Time (Phone)',
        data: screentime,
        borderWidth: 1,
        borderColor: '#656E77',
        backgroundColor: '#656E77'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


</script>


<script>

    let sum1 = 0, sum2 = 0, sum3 = 0;
    for (let i = 0; i < days; i++) {
        sum1 += screentime[i];
        sum2 += sleeptime[i];
        sum3 += bedtime[i];
    }
    let min_sct = screentime[0];
    let max_sct = screentime[0];
    let min_spt = sleeptime[0];
    let max_spt = sleeptime[0];
    let min_bt = bedtime[0];
    let max_bt = bedtime[0];
    for (let j = 0; j < days; j++) {
        if (min_sct > screentime[j]) {
            min_sct = screentime[j];
        }
        if (max_sct < screentime[j]) {
            max_sct = screentime[j];
        }
        if (min_spt > sleeptime[j]) {
            min_spt = sleeptime[j];
        }
        if (max_spt < sleeptime[j]) {
            max_spt = sleeptime[j];
        }
        if (min_bt > bedtime[j]) {
            min_bt = bedtime[j];
        }
        if (max_bt < bedtime[j]) {
            max_bt = bedtime[j];
        }

    }
    console.log(min_spt, max_spt);
    
    let median_screentime = 0, median_sleeptime = 0, median_bedtime;
    if (days%2 == 0) {
        median_screentime = (screentime[days/2] + screentime[days/2 -1])/2;
        median_sleeptime = (sleeptime[days/2] + sleeptime[days/2 -1])/2;
        median_bedtime = (bedtime[days/2] + bedtime[days/2 -1])/2;
    }
    else {
        median_screentime = screentime[(days-1)/2];
        median_sleeptime = sleeptime[(days-1)/2];
        median_bedtime = bedtime[(days-1)/2];
    }
    mean_screentime = Math.floor(sum1/days);
    mean_sleeptime = Math.floor(sum2/days);
    mean_bedtime = sum3/days;
    
    
    
    
    document.getElementById('mean_sleeptime_count').innerHTML = String(get_formatted_time(mean_sleeptime));
    document.getElementById('median_sleeptime_count').innerHTML = String(get_formatted_time(median_sleeptime));
    document.getElementById('max_spt_count').innerHTML = String(get_formatted_time(max_spt));
    document.getElementById('min_spt_count').innerHTML = String(get_formatted_time(min_spt));

    document.getElementById('mean_screentime_count').innerHTML = String(get_formatted_time(mean_screentime));
    document.getElementById('median_screentime_count').innerHTML = String(get_formatted_time(median_screentime));
    document.getElementById('max_sct_count').innerHTML = String(get_formatted_time(max_sct));
    document.getElementById('min_sct_count').innerHTML = String(get_formatted_time(min_sct));

    document.getElementById('mean_bt').innerHTML = String(get_bedtime(mean_bedtime));
    document.getElementById('median_bt').innerHTML = String(get_bedtime(median_bedtime));
    document.getElementById('max_bt').innerHTML = String(get_bedtime(max_bt));
    document.getElementById('min_bt').innerHTML = String(get_bedtime(min_bt));
    

    let workouts = ['S','B&B','C&T','L','none','S','C&T','none'];
    let S = 0, BnB = 0, CnT = 0, L = 0, no = 0;

    for (let k = 0; k < days; k++) {

        if (workouts[k] == 'S') {
            S++;
        }
        else if (workouts[k] == 'B&B') {
            BnB++;
        }
        else if (workouts[k] == 'C&T') {
            CnT++;
        }
        else if (workouts[k] == 'L') {
            L++;
        }
        else {
            no++;
        }


    }

    let count = 0, maxcons = 0, i = 0, break_count=0, max_break=0;
    while (i < days) {
        if (workouts[i] == 'S' || workouts[i] == 'B&B' || workouts[i] == 'C&T' || workouts[i] == 'L'){
            i++;
            count++;
            maxcons = Math.max(count, maxcons);
            break_count=0;
        }
        else {
            count = 0;
            i++;
            break_count++;
            max_break = Math.max(max_break, break_count);
        }
    }
    let total_count = S+BnB+CnT+L;

    document.getElementById('total_count').innerHTML = String(total_count);
    document.getElementById('S_count').innerHTML = String(S);
    document.getElementById('BnB_count').innerHTML = String(BnB);
    document.getElementById('CnT_count').innerHTML = String(CnT);
    document.getElementById('L_count').innerHTML = String(L);
    document.getElementById('maxcons_count').innerHTML = String(maxcons);
    document.getElementById('maxbreak_count').innerHTML = String(max_break);
    
    console.log(S,BnB,CnT,L,maxcons,max_break);
    

</script>




