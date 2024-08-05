namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StationsImport;
use App\Imports\ObservationsImport;

class ImportData extends Command
{
    protected $signature = 'import:data';
    protected $description = 'Import station and observation data from Excel files';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $stationFilePath = storage_path('app/data/stations.xlsx');
        $observationFilePath = storage_path('app/data/observations.xlsx');

        if (file_exists($stationFilePath)) {
            Excel::import(new StationsImport, $stationFilePath);
            $this->info('Station data imported successfully.');
        } else {
            $this->error('Station file not found.');
        }

        if (file_exists($observationFilePath)) {
            Excel::import(new ObservationsImport, $observationFilePath);
            $this->info('Observation data imported successfully.');
        } else {
            $this->error('Observation file not found.');
        }
    }
}
